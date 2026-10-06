init:
	docker compose run --rm app npm install js-yaml

publish:
	docker compose run --rm app node .github/merger.js

# La generación de lexicones ya no vive en este repositorio: la hace el motor de
# kanji-api (`make lexicones` allí), que escribe en lexicon/lexicon/. Ver el ADR
# 0006 de kanji-api.
