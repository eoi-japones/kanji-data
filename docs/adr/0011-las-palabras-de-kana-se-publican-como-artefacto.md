# Las palabras de kana se publican como artefacto propio

El examen de kana necesita un vocabulario de palabras cuya lectura sea íntegramente
kana. Ese vocabulario sale del matome de guilliman web y hasta ahora solo existía como
entidades sueltas en el bundle de `kanji-api`, sin fuente revisable en `kanji-data`.
Decidimos que las palabras de kana sean un tipo de artefacto de `kanji-data`, con YAML
individuales en `vocabulario/palabras-kana/` y su esquema
`schemas/palabra-kana.schema.json`. El motor que las genera vive en `kanji-api`, que lee
el matome del servidor local de guilliman web y escribe los YAML en este repositorio; el
merge pone el sobre `kind: kanji.eoi/palabra-kana` y `version: v1` al publicar.

## Contexto

- El bundle de `kanji-api` ya llevaba `kanji.eoi/palabra-kana`, pero generado
  directamente contra el JSON de salida. El contenido no se podía revisar ni validar en
  `kanji-data`.
- `DEFINICIONES.md` exige que todo el conocimiento viva en YAML bien formados y que cada
  paquete tenga su `RULES.md`; `ADR 0001` y `ADR 0003` fijan el YAML por entidad y el
  tipo por carpeta.
- El examen necesita cubrir hiragana y katakana; las palabras con katakana son minoría
  en el matome.

## Decisión

- Los YAML de origen viven en `vocabulario/palabras-kana/`, un artefacto por palabra.
- El nombre del fichero es `<nivel>_<seccion>_<palabra>.yml` y el `id` es
  `<nivel>/<seccion>/<palabra>`.
- El esquema no admite campos fuera de `id`, `palabra`, `forma_kanji`, `significado`,
  `imagen`, `nivel` y `seccion`.
- `.github/validar-palabras-kana.js` comprueba nombre, coherencia del `id`, duplicados y
  que la imagen esté bajo `/vocabulario/imagenes/<nivel>/<seccion>/`.
- `.github/merger.js` publica el `kind` y la `version`; el YAML de origen no los lleva.
- La generación se limita a 150 palabras y reserva primero las que contienen katakana.

## Alternativas descartadas

- **Mantener solo el bundle generado**: el vocabulario no se puede revisar ni validar en
  `kanji-data`, y una regeneración pisa cambios sin dejar historial legible.
- **Guardar el vocabulario dentro de un lexicon**: el lexicon responde «qué palabras
  contienen este kanji»; la palabra de kana responde «qué palabras se pueden preguntar
  en el examen». Son dos conceptos y dos paquetes.
- **Generar el bundle directamente desde el merge**: deja fuera el YAML de origen y el
  esquema, que son la fuente de verdad.

## Consecuencias

- El vocabulario se revisa en Pull Request como el resto de artefactos.
- `kanji-api` conserva el motor y la lógica del examen; `kanji-data` conserva datos y
  esquema.
- La lista de paquetes de `DEFINICIONES.md` queda incompleta, como ya ocurre con
  `kanas/`, `yomi/` o `meta-data/grupos/`; no se toca en este cambio.
