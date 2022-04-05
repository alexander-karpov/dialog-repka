from functools import lru_cache
from entity_parser import entity_parser
import json
import dawg
import random
from morph import inflect, morph


completion_dawg = dawg.CompletionDAWG()
completion_dawg.load('./adj.dawg')


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

    return response


def has_one_word(entity) -> bool:
    return entity['nomn'].find(' ') == -1


def enrich_entity(entity) -> None:
    if not has_one_word(entity):
        return

    res = find_adj(morph.parse(entity["nomn"]))

    if not res:
        return

    adj_nomn, tag = res
    adj_accs, _ = inflect(adj_nomn, [{ 'accs', tag.gender, tag.number }])

    if adj_nomn and adj_accs:
        entity["enriched_nomn"] = f"{adj_nomn} {entity['nomn']}"
        entity["enriched_accs"] = f"{adj_accs} {entity['accs']}"


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
            _, adj = selected.split(':')

            adj_inf, _ = inflect(adj, [{ p.tag.gender, p.tag.case, p.tag.number }])

            return adj_inf, p.tag if adj_inf else None

    return None


def handler(event, context):
    entities = parser(event['queryStringParameters']['text'])

    try:
        for entity in entities:
            enrich_entity(entity)
    except Exception:
        print('Ошибка в enrich_entity')

    return {
        'statusCode': 200,
        'headers': {
            'Content-Type': 'application/json'
        },
        'isBase64Encoded': False,
        'body': json.dumps(entities)
    }
