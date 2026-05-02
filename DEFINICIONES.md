# DEFINICIONES.md

> **Documento con fuerza suprema** según la **Regla 2** de la Constitución.

---

## Naturaleza de las Definiciones

**Las definiciones contenidas en este fichero son ABSOLUTAS.**

- No pueden ser modificadas, redefinidas ni contradichas por ningún otro documento, agente o colaborador.
- Solo pueden ser cambiadas siguiendo estrictamente lo establecido en la **CONSTITUCION.md** (Regla 2 y Regla 6).
- Cualquier intento de redefinir o alterar una definición aquí contenida sin la autorización expresa de la Constitución se considerará **inválido**.

---

## 1. Kanji

**Definición:**  
El principal elemento de estudio de este repositorio. Es un carácter logográfico de origen chino utilizado en la escritura japonesa.

**ID:**  
El kanji mismo (ej: 学, 水, 人)

**Clave:**  
Clave única de identificación (ej: 'gaku', 'mizu', 'hito')

**Historia:**  
Historia o etimología del kanji (origen, evolución, componentes). Todo kanji debe incluir obligatoriamente una historia.

**Solo componente:**  
`false` (por defecto). Un kanji puede ser utilizado también como componente único cuando `solo_componente: true`.

### Normas de Almacenamiento y Nomenclatura (Obligatorias para Kanji)

- Todo kanji **solo puede definirse** como fichero dentro de la carpeta `data/` situada en la raíz del repositorio.
- El fichero debe seguir **estrictamente** la nomenclatura: `id, clave.yml` (ej: `学, gaku.yml`).
- Todo fichero debe cumplir **estrictamente** el esquema JSON ubicado en `schemas/kanji.schema.json`.

---

## 2. Solo Componente

**Definición:**  
Un elemento gráfico que se comporta como un kanji pero que **no existe realmente** en la lengua japonesa. Se utiliza exclusivamente como andamio pedagógico para facilitar la construcción de historias y el aprendizaje de kanjis reales.

**ID:**  
El carácter ficticio (ej: 氵, 扌, 艹)

**Clave:**  
Clave única (ej: 'sanzui', 'tehen', 'kusakanmuri')

**Historia:**  
Historia o explicación pedagógica de por qué se usa este componente ficticio.

**Solo componente:**  
`true` (siempre). Es su característica principal.

### Normas de Almacenamiento y Nomenclatura

Sigue **exactamente** las mismas normas que el Kanji (ver sección 1), con las siguientes diferencias:

- Los ficheros deben ir obligatoriamente en la subcarpeta `data/componentes/`.
- Ejemplo de nomenclatura: `氵, sanzui.yml`

---

## 3. Grupo

**Definición:**  
Una estructura que engloba varios kanji unidos por algún tipo de **criterio semántico** (significado común, tema, radical compartido, etc.).

**Estructura obligatoria:**

- **id**: Identificador único en todo el sistema.
- **nombre**: Nombre único del grupo.
- **descripción**: Descripción del criterio semántico que une a los kanji del grupo.
- **integrantes**: Conjunto de kanji que componen el grupo (obligatorio).
- **auxiliares**: Kanji que se presentan por primera vez en el grupo, pero que **no están integrados** dentro del grupo. Son componentes de otros kanji del grupo y sirven como apoyo pedagógico.

**Estructura de auxiliares:**

Cada auxiliar es un objeto con dos campos:

```yaml
auxiliar:
  id: "id del kanji auxiliar"
  para: "id del kanji que ayuda a construir"
```

**Características obligatorias:**
- Un Grupo **solo puede estar hecho de kanji** (no puede contener Solo Componentes ni otros Grupos).
- Los `auxiliares` son kanji que aparecen por primera vez en el contexto del grupo, pero no forman parte de los `integrantes`.

**Validación Semántica (Obligatoria):**
- **Ningún kanji puede pertenecer a dos grupos** diferentes.
- **Ningún kanji puede salir más de una vez** dentro del mismo grupo.

**Almacenamiento (Especial):**  
- Los Grupos se almacenan en la carpeta `meta-data/grupos/` del root del repositorio.
- Cada grupo es un fichero **YAML** con la nomenclatura: `id.yml` (ej: `agua.yml`, `radical_72.yml`).
- Debe cumplir **ESTRICTAMENTE** el esquema JSON situado en `schemas/grupo.schema.json`.

---

## 4. Itinerario (Iter)

**Definición:**  
Una agrupación de **Grupos de kanji**. El orden de los grupos que engloba **es relevante**.

**Estructura obligatoria:**

- **id**: Identificador único en todo el sistema.
- **nombre**: Nombre único del iter.
- **descripción**: Descripción del propósito o criterio de agrupación de los grupos.
- **iter**: Array ordenado con los `id` de los Grupos que engloba (el orden es significativo).

**Características obligatorias:**
- Un Iter solo puede contener **Grupos** (no puede contener kanji directamente ni Solo Componentes).
- El orden de los elementos en el array `iter` tiene **significado semántico** y debe respetarse.

**Validación Semántica (Obligatoria):**
- **Ningún grupo puede pertenecer a más de un iter.**

**Almacenamiento:**  
Se guarda en la carpeta `meta-data/itinerarios/` del root del repositorio.  
El fichero debe seguir la nomenclatura `id.ymal` (ej: `n5-completo.ymal`).  
Debe cumplir **ESTRICTAMENTE** el esquema JSON situado en `schemas/iter.schema.json`.

---

