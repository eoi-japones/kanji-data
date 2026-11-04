# Los guiones se publican como un artefacto más del bundle

La Sesión en clase necesita guiones: secuencias de escenas con textos, imágenes y
actividades que el profesor recorre en clase. ADR-0003 fija que el tipo de artefacto se
deduce de la carpeta que contiene el fichero y que el sobre `kind`/`version` se añade solo
al publicar. Los guiones encajan en ese modelo: son contenido curado, no configuración de
la aplicación, y su fuente debe vivir junto al resto de la base de conocimiento.

Decidimos que los guiones sean un tipo de artefacto propio:

- Un fichero YAML por guion en `guiones/`, con el `id` como nombre de fichero.
- El guion contiene sus escenas y actividades **anidadas**; no hay ficheros sueltos de
  escena ni de actividad.
- El merger le añade `kind: kanji.eoi/guion` y `version: v1` y lo escribe en el bundle
  como una entrada más.
- `.github/validar-schema.js` lo valida con `schemas/guion.schema.json`.

Las imágenes de las escenas **no** viven aquí: se publican en el repositorio de
contenidos y el guion guarda su URL absoluta (ADR-0018 y ADR-0019 de `kanji-api`).

## Formato

```yaml
id: cuento-ave
nombre: Cuento-ave
escenas:
  - id: jaula
    nombre: El pollito en la jaula
    tipo: slide
    partes:
      - tipo: texto
        texto: "En una jaula de alambre vivía un pollito."
      - tipo: imagen
        url: https://eoi-japones.github.io/contenidos/guiones/cuento-ave/jaula.webp
    actividades:
      - id: dibujar-chistera
        nombre: Dibujar el componente chistera
        tipo: escribir
        kanji: 亠
        barrera: true
```

Los ids son únicos dentro del guion; el validador comprueba que no se repitan entre el
guion, sus escenas y sus actividades. Los tipos de parte y de actividad son cerrados y
están descritos en el esquema.

## Estado

**aceptado** — amplía ADR-0003 con la carpeta `guiones/`.

## Opciones consideradas

- **Guardar los guiones fuera de `kanji-data`**: descartado. Son contenido curado y su
  fuente debe revisarse y publicarse con el resto de la base de conocimiento.
- **Un fichero por escena y otro por actividad**: descartado. El guion es un documento
  cerrado; separar sus piezas obliga a inventar referencias y a resolver colisiones de
  ids entre guiones.
- **Incluir las imágenes en este repositorio**: descartado. Las ilustraciones son
  material editorial de contenidos, no fichas de estudio (ADR-0019 de `kanji-api`).
- **Un guion como JSON generado a mano**: descartado. El YAML es la fuente de curación y
  el JSON se genera al publicar, como en el resto de artefactos.

## Consecuencias

- Añadir o cambiar un guion cambia el bundle publicado, igual que añadir un kanji o un
  lexicon.
- `guiones/` entra en el recorrido del validador y del merger mediante `GUION_DIR`; las
  rutas de CI y del compose lo declaran.
- El esquema es la única fuente de verdad de la forma del guion en origen. Un cambio de
  formato exige subir `version` y actualizar el validador de `kanji-api`.
- Las URLs de las imágenes apuntan a `contenidos`; publicar un guion exige publicar antes
  sus imágenes.
