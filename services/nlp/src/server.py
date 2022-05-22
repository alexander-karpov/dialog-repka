import os
import json
from flask import Flask, request
from nlp import nlp
from model import Word


app = Flask(__name__)


@app.route("/", methods=['POST'])
def process():
    if request.json is None:
        return json.dumps({ "error": "Не удалось считать json запроса" }, ensure_ascii=False)

    req = request.json
    text: str = req['text']

    words = (Word.create(word) for sent in nlp(text).sentences for word in sent.words)

    return json.dumps({
        "text": [w.person_changed_text() for w in words]
    }, ensure_ascii=False)


if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=os.environ['PORT'])
