# El lexicon es un tipo de artefacto propio: una familia por carácter, en `lexicon/lexicon/`

Un lexicon es la familia de palabras que comparten un kanji concreto, y su propósito es ayudar al estudiante al reconocimiento de palabras y a su aprendizaje. Introducirlo obligaba a resolver cuatro colisiones con decisiones que ya estaban tomadas: el nombre, la carpeta, la identidad y la relación con las palabras que ya existían en los grupos yomi.

## Estado

**aceptado**

## Opciones consideradas

- **Término canónico «Léxico», en castellano**: descartado. El repositorio trabaja en castellano y `CONSTITUCION.md` Regla 2.2 prohíbe errores ortográficos, pero la forma natural para quien escribe el contenido es *lexicon*. Se acepta el término tal cual y se fija su plural **lexicones** en `CONTEXT.md`, para que nadie lo corrija después a *lexicons* ni a *léxicos*.
- **Renombrar la carpeta de pistas para liberar `lexicon/`**: descartado. `lexicon/hints-kanji/` lleva la ruta en tres sitios (`KANJI_HINT_DIR` del workflow de validación, `a.sh` y la skill `validar-kanji`) y moverlo no aporta nada frente a crear `lexicon/lexicon/`. Además `determinarTipo()` decide el tipo por la carpeta contenedora inmediata, de modo que `hints-kanji` y `lexicon` se distinguen sin tocar código.
- **Declarar `lexicon/` como paquete**: descartado. `DEFINICIONES.md` define Paquete como una agrupación de artefactos **del mismo tipo**, y esa carpeta contendría pistas y lexicones; cambiar la definición violaría `CONSTITUCION.md` Regla 2.3. El paquete es `lexicon/lexicon/`, de un solo tipo.
- **Nomenclatura `id,clave.yaml`, como en `data/`**: descartada. Implicaría que un carácter con dos claves tiene dos familias, y no las tiene: las palabras pertenecen al carácter, no a la clave mnemotécnica. Con `<id>.yaml` hay una sola familia por carácter y el sistema de ficheros garantiza la unicidad.
- **Nomenclatura `<clave>.yaml`**: descartada. La clave no es única —`愛` e `恋` comparten `amor`— y el nombre no sirve a quien busca el carácter.
- **Migrar los `ejemplos` de los grupos yomi dentro del lexicon**: descartada por ahora. Exige integridad referencial entre paquetes, que es exactamente el problema abierto del ADR 0005, y reescribir los 88 ficheros de yomi. El ejemplo responde «¿qué comparten lectura estos kanji?» y el lexicon responde «¿qué palabras contienen este kanji?»: conviven sin referenciarse.
- **No publicar los lexicones**: descartado. Un concepto que no entra en el artefacto no llega al estudiante. Se publica con `kind: kanji.eoi/lexicon` y `version: v1`.

## Consecuencias

- El tipo se deduce de la carpeta (ADR 0003), así que hay que mantener la rama `lexicon` en **los dos** `determinarTipo()` simultáneamente: `.github/validar-schema.js` y `.github/merger.js`, que el ADR 0003 ya advertía que divergen.
- `LEXICON_DIR` es opcional en el código: si no está declarada, la carpeta no se recorre. Si no, `walk()` caería por defecto en `META_DIR` y procesaría los meta-datos dos veces.
- La misma palabra puede estar en un lexicon y en un ejemplo de yomi. Corregir una lectura en un sitio **no** la corrige en el otro: es duplicidad consciente, no un descuido.
- La validación de la máscara, antes inexistente, se aplica también a los 282 ejemplos de yomi. Los que había cuadraban todos; a partir de ahora, un ejemplo con la máscara mal escrita rompe la Pull Request.
- El lexicon no usa el campo `clave`, con lo que la identidad del kanji (ADR 0002) queda fuera de este artefacto: se resuelve íntegramente por carácter.
- La fuente de la web no vive en este repositorio (ADR 0004), así que el artefacto puede publicarse con lexicones antes de que exista una vista que los muestre.
