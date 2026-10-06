# Los lexicones se generan de forma determinista desde JMdict

Los lexicones del paquete `lexicon/lexicon/` dejan de redactarse a mano: un script determinista los deriva de un diccionario externo (JMdict + KANJIDIC) filtrando el vocabulario al inventario de kanji de `data/`, y una skill redacta únicamente los campos de idioma. El objetivo es que el conjunto de palabras de cada familia sea completo, reproducible y reevaluable cada vez que cambia el inventario de kanji.

## Estado

**aceptado**

## Decisión

- **Universo**: todas las entradas de JMdict cuya grafía principal use **solo** kanji presentes en `data/` (raíz o `componentes/`) y que no sean nombres propios ni voces arcaicas u obsoletas. La familia la da un kanji no solo-componente de la palabra; los solo-componentes pueden aparecer como acompañantes (読者, con 者 en `data/componentes/`). No hay umbral de frecuencia.
- **Una fila por entrada**: grafía principal + lectura principal; se descartan las variantes.
- **Orden**: por frecuencia de uso (etiquetas `news1`/`ichi1`/`nfXX`), de más a menos común.
- **Máscara**: retroceso sobre las lecturas on/kun de KANJIDIC; los caracteres kana de la palabra se casan literalmente. Lo que no cuadra se reparte de forma aproximada —el tramo dudoso de cada racha de kanji va al primero— y queda en una lista de revisión; una **excepción** puede fijar el reparto correcto.
- **Tipo de lectura**: manda el kanji de la familia (on si su tramo es on, kun si es kun).
- **Campos de idioma**: `significado`, `frase` y `traduccion` los redacta la skill a partir de las glosas de JMdict; la parte determinista no los inventa.
- **Contenido de idioma por palabra única**: la skill redacta una vez por palabra única; el generador re-marca mecánicamente la `frase` para cada familia envolviendo el kanji de la familia en `(...)`. Cuando la palabra aparece conjugada y no se puede localizar, se redacta por familia.
- **Lotes**: la generación y la redacción avanzan por lotes priorizados (primero los kanji de los itinerarios y grupos); una palabra que aún no tiene idioma no produce fichero, de modo que el paquete nunca contiene ficheros a medias.
- **Reparto de trabajo**: un único comando calcula el conjunto objetivo y emite una **worklist** efímera (fuera del paquete) con las palabras nuevas; la skill la redacta; el comando ensambla por *merge* con clave `palabra` —conserva los campos de idioma ya escritos, añade los nuevos y elimina las palabras que salen del universo—. El YAML solo se escribe completo, porque `RULES.md` §2 no admite ficheros a medias.
- **Excepciones**: se guardan en `lexicon/excepciones/` como artefacto propio, con `kind: kanji.eoi/lexicon-excepciones` y `version: v1`, y se publican en el bundle. No son un campo del lexicon.
- **Cobertura**: un kanji con menos de dos palabras elegibles no tiene lexicon; la generación emite la lista de cobertura con el motivo.
- **Evaluación**: el mismo comando en modo `--check` exige, en cada fichero presente, conjunto de palabras, campos deterministas y campos de idioma; un job de CI falla ante cualquier deriva. La cobertura —cada kanji con ≥2 palabras tiene fichero— empieza como informe, porque el avance es por lotes, y solo se convierte en requisito duro cuando el despliegue se cierra.

## Opciones consideradas

- **Redacción manual**, como hasta ahora: descartada. No garantiza que el vocabulario sea completo ni que siga siéndolo al crecer el inventario.
- **Derivar los lexicones de los ejemplos de yomi**: descartada. Responden a preguntas distintas (ADR 0006) y solo cubren lecturas on.
- **Generación combinatoria de kanji + kana**: descartada. Produciría formas que no son palabras; el diccionario es el que decide qué existe.
- **Dos artefactos separados, índice generado y almacén de textos**: descartada. Duplicaría la fuente de verdad y complicaría la validación; el *merge* sobre un único fichero conserva lo redactado sin separar el dato.
- **Tipo de lectura por mayoría de tramos**: descartada. El lexicon existe para el kanji de la familia y esa es la lectura que el estudiante asocia.

## Consecuencias

- La generación depende de JMdict y KANJIDIC con versión fijada; la versión queda registrada y hay que actualizarla a conciencia.
- El paquete gana un artefacto nuevo (`lexicon-excepciones`) y `determinarTipo()` necesita la rama `excepciones` en **los dos** sitios (`.github/validar-schema.js` y `.github/merger.js`), que el ADR 0003 advierte que divergen.
- Medido contra JMdict 3.6.2 y los 1142 kanji no solo-componente: 59 218 palabras elegibles, 1123 lexicones y 134 868 entradas palabra×familia (cada una con `frase` y `traduccion`). El grueso se concentra en pocos kanji (学 1331, 人 1293, 大 1287). La redacción por la skill es un problema de volumen, no de un puñado de casos.
- `byobu` no consume hoy el artefacto de excepciones —lee la `mascara` inline de cada palabra—; se publica por trazabilidad y se indexa por `palabra` + `lectura` para que un consumidor futuro no obligue a cambiar la forma.
- Los 熟字訓 y las lecturas irregulares se reparten de forma aproximada y salen en la lista de revisión; el fichero de excepciones permite afinarlos sin tocar el generador. La evaluación puede exigir que toda excepción siga siendo necesaria.
