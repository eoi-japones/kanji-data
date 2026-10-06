# `docs/` es la raíz única de publicación: la web y los datos comparten directorio

`docs/` es a la vez la raíz del sitio web publicado (`docs/index.html`, con base `/kanji-data/`, servido por GitHub Pages desde el propio repositorio) y el destino previsto del artefacto de datos que consume esa misma web (`docs/kanji.json`). La publicación se resuelve así porque GitHub Pages solo sirve contenido comprometido en el repositorio: poner los datos donde se sirve evita un segundo origen, un segundo repositorio o un despliegue adicional.

## Estado

**aceptado**

> **Nota (2026-10-06).** El merger ya no depende de que cada carpeta esté
> declarada: usa la ruta del repositorio por defecto y sobrescribe el fichero de
> salida, de modo que `node .github/merger.js` produce el bundle completo, con
> los lexicones. Las dos vías de publicación (`make publish` y
> `kanji-publish.yaml`) escriben ahora `docs/kanji.data`, el artefacto que este
> ADR daba por previsto; `docs/kanji.json` sigue siendo el JSONL obsoleto y no se
> toca.

## Opciones consideradas

- **Rama dedicada o repositorio separado para los datos**: descartada. Exigiría publicar dos orígenes y sincronizarlos.
- **Activos de release o CDN externo**: descartados. Rompería el principio de que todo lo que consume la web vive y se revisa en este repositorio.
- **API en tiempo real**: descartada. El volumen no la justifica y añadiría infraestructura a un proyecto mantenido por una comunidad de estudio.

## Consecuencias

- `docs/` es un directorio **comprometido y generado a la vez**: contiene el bundle de la web, las imágenes optimizadas, el artefacto de datos y —desde ahora— estos ADR, accesibles públicamente en `https://eoi-japones.github.io/kanji-data/adr/`.
- **La fuente de la web no vive en este repositorio.** Aquí solo está el bundle compilado (`docs/assets/index-*.js`, con hash) más dos librerías de desarrollo (`docs/kanji-lib.js`, `docs/contents-lib.js`), y no hay `package.json`, `src/` ni configuración de build. Esto importa porque las convenciones de contenido se definen allí: la función que interpreta la `mascara` de los ejemplos yomi y la que formatea `nombre` e `historia` están en ese bundle, no en este repositorio. Quien cambie una máscara tiene que mirar el código de la web para saber qué espera.
- El artefacto de datos que hoy se sirve, `docs/kanji.json`, está obsoleto y en un formato que ningún script actual produce. Son 542 registros en JSON Lines, generados junto con `Makefile` y `docker-compose.yaml` en el commit `e52034e` («Agregar herramienta de publicación») y corregidos a mano una sola vez desde entonces. En cambio `.github/merger.js` escribe **un único array JSON**, y el artefacto que crearía —`docs/kanji.data`— no existe. Completa hoy, publicaría 1682 entradas.
- Hay dos rutas de salida sin sincronizar: `make publish` (`docker-compose.yaml`, `OUTPUT_FILE=docs/kanji.json`) y `.github/workflows/kanji-publish.yaml` (produce `kanji.data` y lo mueve a `docs/`). Además ninguna de las dos se ejecuta sola: `kanji-validate` corre en cada Pull Request, pero `kanji-publish` y `img-converter` solo se lanzan a mano con `workflow_dispatch`.
- Poner los datos donde se sirve evitó un segundo origen, un segundo repositorio y un despliegue adicional, a costa de que un artefacto generado pueda quedar envejecido en el repositorio sin que nada lo detecte.
