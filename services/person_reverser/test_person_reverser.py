import sys
from typing import Tuple
from index import reverse_person_in_text
import pytest


@pytest.mark.parametrize("cases", [
    ("я думаю ты хороший", "ты думаешь я хороший"),
    ("иди и подумай над твоим поведением", "иду и подумаю над моим поведением"),
])
def test_inflection(cases: Tuple[str, str]):
    text, expected = cases
    actual = reverse_person_in_text(text)

    assert actual == expected


if __name__ == "__main__":
    sys.exit(pytest.main())
