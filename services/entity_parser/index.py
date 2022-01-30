from functools import lru_cache
from entity_parser import entity_parser
import json


@lru_cache(2048)
def parser(text: str) -> str:
    response = []

    for m in entity_parser.findall(text):
        nomn = m.fact.inflect({ 'nomn' })
        accs = m.fact.inflect({ 'accs' })
        subject = nomn.subject()

        response.append({
            'nomn': str(nomn),
            'accs': str(accs),
            'subject': subject.name,
            'tags': str(subject.tag)
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
