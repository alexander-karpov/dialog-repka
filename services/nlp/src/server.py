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
    changed = [w.person_changed_text() for w in words]

    """
    Меняем союз с -> со когда нужно
    """
    for i in range(len(changed) - 1):
        if changed[i] == "с" and changed[i + 1] == 'мной':
            changed[i] = "со"

        if changed[i] == "со" and changed[i + 1] == 'тобой':
            changed[i] = "с"


    return json.dumps({
        "text": changed
    }, ensure_ascii=False)


if __name__ == "__main__":
    from waitress import serve
    serve(app, host="0.0.0.0", port=os.environ['PORT'])
