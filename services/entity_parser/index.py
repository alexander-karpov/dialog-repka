from functools import lru_cache
from entity_parser import entity_parser
import json


@lru_cache(2048)
def parser(text: str) -> str:
    response = []

    for m in entity_parser.findall(text):
        fact = m.fact
        subject = fact.subject()

        response.append({
            'nomn': str(fact),
            'accs': str(fact.inflect({ 'accs' })),
            'subject': subject.name,
            'tags': subject.tags
        })

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
