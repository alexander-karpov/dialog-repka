# syntax=docker/dockerfile:1
FROM pytorch/pytorch:latest

WORKDIR /app

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

# RUN mkdir -p /usr/local/share/ca-certificates/Yandex
# COPY YandexInternalRootCA.crt /usr/local/share/ca-certificates/Yandex/YandexInternalRootCA.crt

COPY ./src .

RUN pip install -r requirements.txt

EXPOSE 5000

CMD ["python3", "server.py"]
