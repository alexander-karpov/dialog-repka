from morph import inflect

class Word:
    @staticmethod
    def create(token) -> 'Word':
        if token.upos == "PRON":
            return Pronoun(token)

        if token.upos == "DET":
            return Determiner(token)

        if token.upos == "VERB" or token.upos == "AUX":
            return Verb(token)

        return Word(token)

    def __init__(self, token):
        self._token = token

    def person_changed_text(self):
        return self._token.text


class Verb(Word):
    def __init__(self, token):
        self._token = token

    def person_changed_text(self):
        if  self._token.text == 'давай':
            return self._token.text

        if 'VerbForm=Inf' in self._token.feats:
            return self._token.text

        tags = set()

        if 'Person=1' in self._token.feats:
            tags.add('2per')

        if 'Person=2' in self._token.feats:
            tags.add('1per')

        if not len(tags):
            return self._token.text

        inflected, _ = inflect(self._token.text, (frozenset(tags), ))

        return inflected


class Pronoun(Word):
    _change_map = {
        'я': 'ты',
        'меня': 'тебя',
        'мне': 'тебе',
        'мной': 'тобой',

        'мы': 'вы',
        'нас': 'вас',
        'нам': 'вам',
        'нами': 'вами',

        'мой': 'твой',
        'моего': 'твоего',
        'моему': 'твоему',
        'моим': 'твоим',
        'моём': 'твоём',
        'моем': 'твоем',

        'моя': 'твоя',
        'моей': 'твоей',
        'мою': 'твою',

        'мое': 'твое',
        'моё': 'твоё',

        'мои': 'твои',
        'моих': 'твоих',
        'моим': 'твоим',
        'моими': 'твоими',

        'наш': 'ваш',
        'нашего': 'вашего',
        'нашему': 'вашему',
        'нашими': 'вашими',
        'наших': 'ваших',
    }

    _change_map.update({v: k for k, v in _change_map.items()})

    def person_changed_text(self):
        text = self._token.text.lower()

        return Pronoun._change_map.get(text, text)


class Determiner(Pronoun):
    """
    https://universaldependencies.org/ru/pos/DET.html
    Examples
        possessive determiners: мой, твой, его, её, наш, ваш, их  “my, your, his, her, our, your, their”
        reflexive possessive determiner: свой  “one’s own”
        demonstrative determiners: этот  as in Я видела эту машину вчера.  “I saw this car yesterday.”
        interrogative determiners: какой  as in Какая машина тебе нравится?  “Which car do you like?”
        relative determiners: который  as in Мне интересно, которая машина тебе нравится.  “I wonder which car you like.”
        relative possessive determiner: чей  “whose”
        indefinite determiners: некоторый
        total determiners: каждый
        negative determiners: никакой  as in У нас не осталось никаких машин.  “We have no cars available.”
    """
    pass
