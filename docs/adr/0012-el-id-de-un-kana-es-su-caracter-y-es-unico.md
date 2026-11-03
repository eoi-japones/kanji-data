# El id de un kana es su carácter y es único

Un kana es una ficha del carácter: `id` es el propio signo (`あ`, `ア`, `っ`), no una
clave ni un identificador compuesto. A diferencia de un kanji, un mismo carácter kana no
se estudia bajo dos claves distintas: hay una sola ficha por carácter, y el bundle
publica una sola entidad `kanji.eoi/kana` para él. El nombre del fichero declara ese
`id` y `.github/validar-kanas.js` lo comprueba antes de publicar.

## Contexto

- La regla del ADR 0002 —la clave identifica al kanji y el `id` puede repetirse— es
  específica de los kanji. Aplicarla a los kana permitiría dos fichas del mismo signo con
  historias distintas, y el examen no sabría cuál mostrar.
- El validador trataba `KANA` como un tipo sin identidad: validaba el esquema y salía
  antes de la comprobación de claves. Por eso pasó desapercibido un fichero
  `kanas/hiragana/ち.yaml` con `id: あ`: el bundle publicaba dos veces あ y ninguna ficha
  de ち, mientras la validación seguía en verde.
- `kanas/katakana/チ -katakana.yaml` llevaba un espacio en el nombre. El `id` era
  correcto, pero el nombre no declaraba limpiamente la ficha.

## Decisión

- El `id` de un kana es **un solo carácter** y es **único** en todo el conjunto de kana.
- El nombre del fichero debe ser `<id>.yml`, `<id>-hiragana.yml` o `<id>-katakana.yml`,
  sin espacios sobrantes.
- Un kana de la carpeta `hiragana/` debe ser hiragana y uno de `katakana/`, katakana.
- `.github/validar-kanas.js` comprueba nombre, unicidad, longitud del `id` y coherencia
  con la carpeta; `.github/validar-schema.js` lo ejecuta en cada Pull Request.
- No se exige unicidad de `clave` entre kana: hay claves repetidas legítimas entre
  silabarios (`hawaii` para い y イ) y dentro de un mismo silabario (`medio` para メ y モ).

## Alternativas descartadas

- **Aplicar el ADR 0002 a los kana**: descartada. El `id` duplicado no representa dos
  lecturas pedagógicas distintas, sino un error de contenido que rompe el bundle.
- **Validar solo el esquema**: descartada. El esquema no ve la ruta ni el nombre del
  fichero, que es donde estaba el error.
- **Exigir también claves únicas**: descartada. La clave no es la identidad del kana y
  ya hay repeticiones válidas entre silabarios.

## Consecuencias

- La ficha de ち queda en `kanas/hiragana/ち.yaml`. Ese fichero contenía una copia de `あ.yaml` con `id: あ`; ahora lleva el `id: ち` y su historia correcta.
- Se retira `kanas/hiragana/ち-hiragana.yaml`, que era el fichero duplicado de la misma ficha. No desaparece ningún kana: ち sigue publicado una sola vez.
- El bundle deja de publicar dos veces あ y conserva una sola ficha por carácter: pasan
  93 entidades `kanji.eoi/kana` a 92 (46 hiragana + 46 katakana).
- Se renombra `チ -katakana.yaml` a `チ-katakana.yaml`; el `id` no cambia.
- Un kana nuevo con `id` repetido o con un nombre que no lo declare rompe la Pull
  Request, igual que un kanji con clave repetida.
