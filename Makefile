init:
	docker compose run --rm app npm install js-yaml

publish:
	docker compose run --rm app node .github/merger.js
