docker run -ti --rm -v .:/home/app \
    --workdir /home/app \
    -e DATA_DIR=/home/app/data \
    node:24 \
    node .github/normalizer.js \
    $1
