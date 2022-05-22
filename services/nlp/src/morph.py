from typing import Set, Tuple
import pymorphy2
from functools import lru_cache

morph = pymorphy2.MorphAnalyzer()

@lru_cache(1024)
def inflect(word: str, grs_variants: Tuple[Set[str],...]) -> Tuple[str, str]:
    parsed = morph.parse(word)

    for grs in grs_variants:
        for p in parsed:
            inflected = p.inflect(grs)

            if inflected:
                return [inflected.word, inflected.tag]

    return word
