import stanza

stanza.download('ru', processors="tokenize,pos,lemma,depparse")
nlp = stanza.Pipeline('ru', processors="tokenize,pos,lemma,depparse")
