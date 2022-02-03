from functools import lru_cache
import json
import pymorphy2

morph = pymorphy2.MorphAnalyzer()


def reverse_person(word: str) -> str:
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
            return p[1]

        if p[1] == word:
            return p[0]

    for parsed in morph.parse(word):
        if 'impr' in parsed.tag:
            inflected = parsed.inflect({ 'indc', 'futr' }) or parsed.inflect({'indc' })
            if inflected:
                return inflected.word

        if '2per' in parsed.tag:
            inflected = parsed.inflect({ '1per' })
            if inflected:
                return inflected.word

        if '1per' in parsed.tag:
            inflected = parsed.inflect({ '2per' })
            if inflected:
                return inflected.word

    return word


def reverse_person_in_text(text: str) -> str:
    return ' '.join([reverse_person(w) for w in text.split(' ')])


@lru_cache(2048)
def parser(text: str) -> str:
    response = { 'reversed': reverse_person_in_text(text) }

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
