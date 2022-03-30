from ctypes import Union
from functools import lru_cache
import json
import random
from typing import List, Tuple, Union
import pymorphy2
import dawg

morph = pymorphy2.MorphAnalyzer()

completion_dawg = dawg.CompletionDAWG()
completion_dawg.load('./adj.dawg')

def find_adj(parsed_word) -> str:
    for p in parsed_word:
        if "NOUN" in p.tag:
            # Во избежание странных слов из одной буквы
            if len(p.normal_form) < 3:
                return None

            cases = completion_dawg.keys(f"{p.normal_form}:")

            if not len(cases):
                return None

            selected = random.choice(cases)
            [root, adj] = selected.split(':')

            adj_inf = morph.parse(adj)[0].inflect({ p.tag.gender, p.tag.case, p.tag.number })

            return adj_inf.word if adj_inf else None

    return None

def reverse_person(word: str) -> Tuple[str, str, str, Union[str, None]]:
    pronoun = [
        ('я', 'ты'),
        ('меня', 'тебя'),
        ('мне', 'тебе'),
        ('мной', 'тобой'),

        ('мы', 'вы'),
        ('нас', 'вас'),
        ('нам', 'вам'),
        ('нами', 'вами'),

        ('мой', 'твой'),
        ('моего', 'твоего'),
        ('моему', 'твоему'),
        ('моим', 'твоим'),
        ('моём', 'твоём'),

        ('моя', 'твоя'),
        ('моей', 'твоей'),
        ('мою', 'твою'),

        ('мое', 'твое'),

        ('мои', 'твои'),
        ('моих', 'твоих'),
        ('моим', 'твоим'),
        ('моими', 'твоими'),

        ('наш', 'ваш'),
        ('нашего', 'вашего'),
        ('нашему', 'вашему'),
        ('нашими', 'вашими'),
        ('наших', 'ваших'),
    ]

    for p in pronoun:
        if p[0] == word:
            return (word, p[1], 'NPRO')

        if p[1] == word:
            return (word, p[0], 'NPRO')

    parsed_items = morph.parse(word)

    adj = find_adj(parsed_items)

    for parsed in parsed_items:
        if 'impr' in parsed.tag:
            inflected = parsed.inflect({ 'indc', 'futr' }) or parsed.inflect({'indc' })
            if inflected:
                return (word, inflected.word, str(inflected.tag), adj)

        if '2per' in parsed.tag:
            inflected = parsed.inflect({ '1per' })
            if inflected:
                return (word, inflected.word, str(inflected.tag), adj)

        if '1per' in parsed.tag:
            inflected = parsed.inflect({ '2per' })
            if inflected:
                return (word, inflected.word, str(inflected.tag), adj)

    return (word, word, str(parsed_items[0].tag), adj)


def reverse_person_in_text(text: str) -> List[Tuple[str, str, str, Union[str, None]]]:
    return [reverse_person(w) for w in text.split(' ')]


@lru_cache(2048)
def parser(text: str) -> str:
    tokens = reverse_person_in_text(text)
    reversed = ' '.join(token[1] for token in tokens)

    response = { 'reversed': reversed, 'tokens': tokens }

    return json.dumps(response)


def handler(event, context):
    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'isBase64Encoded': False,
        'body': parser(event['queryStringParameters']['text'])
    }
