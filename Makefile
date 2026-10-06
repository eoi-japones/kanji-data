init:
	docker compose run --rm app npm install js-yaml

publish:
	docker compose run --rm app node .github/merger.js

lexicones:
	docker compose run --rm app node .github/generar-lexicones.js --generar

lexicones-check:
	docker compose run --rm app node .github/generar-lexicones.js --check
