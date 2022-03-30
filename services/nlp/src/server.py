import os
from flask import Flask, request
from nlp import nlp

app = Flask(__name__)


@app.route("/", methods=['GET'])
def greating():
    text = " ".join(w.lemma for w in nlp('это синий кот который раньше был добрый плюшевый Но теперь он стал злой и живой это ты').iter_words())

    return text


if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=os.environ['PORT'])
