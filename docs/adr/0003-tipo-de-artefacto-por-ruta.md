# El tipo de artefacto se deduce de la carpeta contenedora, y el sobre `kind`/`version` se añade solo al publicar

Ningún fichero de origen declara de qué tipo es. `.github/validar-schema.js` y `.github/merger.js` llaman a `determinarTipo()`, que mira el nombre de la carpeta que contiene el fichero (`data` o `componentes` → kanji, `grupos` → grupo, `on` → grupo yomi, `itinerarios` → itinerario, `itinerarios-yomi` → itinerario yomi, `hiragana`/`katakana` → kana, `hints-kanji` → pista, `profile-*` → perfil, `colaboradores` → colaborador) y con eso elige el esquema y, al publicar, la etiqueta. El sobre `kind: kanji.eoi/...` y `version: v1` se escribe **únicamente** en el artefacto publicado, nunca en los YAML de origen.

La razón es que el tipo ya está codificado en la ubicación, que es obligatoria y está fijada por `DEFINICIONES.md` y por cada `RULES.md`: repetirlo dentro de cada uno de los más de 1600 ficheros sería información duplicada que podía desincronizarse.

## Estado

**aceptado**

## Opciones consideradas

- **Campo `kind` explícito en cada fichero**: descartada. Añade ruido a un contenido redactado por personas, obliga a mantener dos fuentes del mismo dato y exigiría extender los ocho esquemas de la raíz, algo que `CONSTITUCION.md` Regla 6.2 prohíbe bajo ningún contexto.
- **Identificar el tipo por el sufijo del nombre de fichero**: descartada. La nomenclatura `id,clave.yml` ya está fijada y no lleva sufijo de tipo.

## Consecuencias

- Mover un fichero a otra carpeta **cambia su tipo**, su esquema y su etiqueta de publicación. Cualquier reorganización de directorios es un cambio de modelo, no un cambio cosmético.
- La lógica de detección está duplicada en dos ficheros y ya difiere: `validar-schema.js` acepta la carpeta `kana` y `merger.js` acepta `kanas`. Ninguna de las dos existe como carpeta contenedora real —los ficheros viven en `kanas/hiragana` y `kanas/katakana`—.
- El desfase no se ha quedado latente: la skill oficial de validación exportaba `KANA_DIR=.../kana/`, de modo que `validar-kanji.sh` terminaba con `ENOENT` antes de validar nada. Se corrigió a `kanas/` al abrir esta decisión. Una carpeta cuyo nombre aparece en varios sitios es un candidato seguro a divergir, y aquí la divergencia bloqueaba el propio proceso de validación.
- Un fichero en una carpeta no reconocida se clasifica como `DESCONOCIDO` y, según el script, se valida con el esquema de colaborador por defecto.
