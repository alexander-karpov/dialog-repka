from typing import Set, List, Tuple
from xmlrpc.client import Boolean
import pymorphy2
from pymorphy2.analyzer import Parse

morph = pymorphy2.MorphAnalyzer()

def _sort_morphemes(morphemes: List[Parse]) -> List[Boolean]:
    '''
    Отдаём предпочтение одушевлённым т.к. как правило
    мы ищем именно их. Решает проблему синонимов типа
    жучок для подслушки и жучок муровей

    Приоритет вин. падежу как более ожидаемому
    Далее приоритет имен. падежу. Чтобы "большой" был муж., а не жен. рода
    '''

    _sorted = sorted(morphemes, key=lambda m: [
        'inan' in m.tag,
        'sing' not in m.tag,
        'accs' not in m.tag,
        'nomn' not in m.tag,
    ])

    '''
    Отсекаем глагоды: чернила – это краска, а не глагол жен.
    '''
    return [
        m for m in _sorted if 'VERB' not in m.tag
    ]

def inflect(word: str, grs_variants: List[Set[str]]) -> Tuple[str, str]:
    parsed = _sort_morphemes(morph.parse(word))

    for grs in grs_variants:
        for p in parsed:
            inflected = p.inflect(grs)

            if inflected:
                return [inflected.word, inflected.tag]

    raise Exception(f"Не найдено склонение {grs_variants} для слова {word}")

def get_tag(word: str):
    parsed = _sort_morphemes(morph.parse(word))

    return parsed[0].tag
