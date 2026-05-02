# DEFINICIONES.md

Las definiciones contenidas en este fichero son **absolutas** y **no pueden ser cambiadas** salvo por lo expresamente establecido en la `CONSTITUCION.md`.

## 1. Kanji

Un kanji es el **principal elemento de estudio** de este repositorio.

**Estructura:**
- `id`: el propio kanji (ej: 愛)
- `clave`: clave única
- `historia`: historia/etimología

**Normas de almacenamiento y nomenclatura (obligatorias):**
- Solo se pueden definir como ficheros en la carpeta `data/` situada en la raíz del repositorio.
- Nomenclatura exacta: `id, clave.yml`
- Cada fichero **debe cumplir estrictamente** el esquema `schemas/kanji.schema.json`

## 2. Solo Componente

Un solo componente es como un kanji, comparte toda su estructura, **salvo que no existe realmente** en la lengua japonesa.

Se utiliza como **andamio pedagógico** para la construcción de historias.

Sigue **exactamente** las mismas normas de almacenamiento y nomenclatura que el Kanji (ver sección 1).

## 3. Grupo

Un grupo es una estructura que engloba kanji unidos por algún criterio semántico. Un grupo **solo puede estar hecho de kanji**.

**Estructura:**
- `id` (único en todo el sistema)
- `nombre` (único también)
- `descripción`
- `integrantes` (conjunto de kanji)
- `auxiliares` (array de objetos con `id` y `para`)

**Validación semántica (obligatoria):**
- Ningún kanji puede pertenecer a dos grupos (independientemente de si es principal o auxiliar).
- Ningún kanji puede aparecer más de una vez dentro del mismo grupo.

**Almacenamiento:**
- Carpeta: `meta-data/grupos/`
- Nomenclatura: `id.yml`
- Esquema: `schemas/grupo.schema.json`

## 4. Itinerario

Un itinerario es una agrupación ordenada de grupos de kanji. El orden **es relevante**.

**Estructura:**
- `id` (único en todo el sistema)
- `nombre` (único también)
- `descripción`
- `iter` (array ordenado con los ids de los grupos)

**Validación semántica (obligatoria):**
- Ningún grupo puede pertenecer a más de un iter.

**Almacenamiento:**
- Carpeta: `meta-data/itinerarios/`
- Nomenclatura: `<id del grupo>.yaml`
- Esquema: `schemas/itinerario.schema.json`

---

*Single Source of Truth*
