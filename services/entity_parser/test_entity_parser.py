import sys
from typing import Tuple
from entity_parser import entity_parser
import pytest


@pytest.mark.parametrize("cases", [
    ("тырышкина", "тырышкин", "тырышкина"),
    ("внучку", "внучка", "внучку"),
    ("ирина карпова", "ирина карпова", "ирину карпову"),
    ("саша карпов", "саша карпов", "сашу карпова"),
    ("фёдор емельяненко", "фёдор емельяненко", "фёдора емельяненко"),
    ("чёрного ворона", "чёрный ворон", "чёрного ворона"),
    ("большого льва", "большой лев", "большого льва"),
    ("чернила", "чернила", "чернила"),
    ("брата какашку", "брат какашка", "брата какашку"),
    ("тут саша", "саша", "сашу"),
])
def test_inflection(cases: Tuple[str, str, str]):
    text, nomn_expected, accs_expected = cases

    entity = entity_parser.find(text).fact
    nomn = entity.inflect({'nomn'})
    accs = entity.inflect({'accs'})

    assert str(nomn) == nomn_expected
    assert str(accs) == accs_expected


if __name__ == "__main__":
    sys.exit(pytest.main())
