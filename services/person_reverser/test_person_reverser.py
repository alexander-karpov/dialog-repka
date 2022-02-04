import sys
from typing import Tuple
from index import reverse_person_in_text
import pytest


@pytest.mark.parametrize("cases", [
    ("я думаю ты хороший", "ты думаешь я хороший"),
    ("иди и подумай над твоим поведением", "иду и подумаю над моим поведением"),
    ("ты съешь нас", "я съем вас"),
])
def test_inflection(cases: Tuple[str, str]):
    text, expected = cases

    tokens = reverse_person_in_text(text)
    text_processed = ' '.join(token[0] for token in tokens)
    actual = ' '.join(token[1] for token in tokens)

    assert text_processed == text
    assert actual == expected


if __name__ == "__main__":
    sys.exit(pytest.main())
