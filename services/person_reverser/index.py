from functools import lru_cache
import json
from typing import List, Tuple
import pymorphy2

morph = pymorphy2.MorphAnalyzer()


def reverse_person(word: str) -> Tuple[str, str, str]:
    pronoun = [
        ('я', 'ты'),
        ('меня', 'тебя'),
        ('мне', 'тебе'),
        ('мной', 'тобой'),
        ('мои', 'твои'),
        ('моих', 'твоих'),
        ('моим', 'твоим'),
        ('моими', 'твоими'),
        ('моих', 'твоих'),
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

    for parsed in parsed_items:
        if 'impr' in parsed.tag:
            inflected = parsed.inflect({ 'indc', 'futr' }) or parsed.inflect({'indc' })
            if inflected:
                return (word, inflected.word, str(inflected.tag))

        if '2per' in parsed.tag:
            inflected = parsed.inflect({ '1per' })
            if inflected:
                return (word, inflected.word, str(inflected.tag))

        if '1per' in parsed.tag:
            inflected = parsed.inflect({ '2per' })
            if inflected:
                return (word, inflected.word, str(inflected.tag))

    return (word, word, str(parsed_items[0].tag))


def reverse_person_in_text(text: str) -> List[Tuple[str, str, str]]:
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
