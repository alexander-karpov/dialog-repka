echo "Enter tag: "
read first_name

docker tag nlp:latest cr.yandex/crpcm8j2o1aa03najl69/nlp:$first_name && \
    docker push cr.yandex/crpcm8j2o1aa03najl69/nlp:$first_name
