**Paquete:** `lexicon/lexicon/`  
**Versión:** 1.0  
**Última actualización:** 2026-10-03  

**Single Source of Truth del paquete lexicon/lexicon/**

Este fichero contiene las reglas específicas y obligatorias para todo el contenido del paquete `lexicon/lexicon/`.  
**Debe respetar estrictamente** la jerarquía establecida en `CONSTITUCION.md` (Regla 3).

## 1. Ámbito de aplicación

Este `RULES.md` aplica a **todo** el paquete `lexicon/lexicon/`.

## 2. Estructura y Ubicación de Archivos (Obligatoria)

- Cada lexicon se define **exclusivamente** como un archivo YAML individual.
- Ubicación exacta: carpeta `lexicon/lexicon/`.
- **Nomenclatura estricta de archivos:**
  - Formato: `<id>.yaml`, donde `<id>` es el carácter del kanji.
  - Ejemplo: `読.yaml` o `水.yaml`.
- El `id` es el carácter, **no** la clave: un mismo carácter tiene **un solo** lexicon, aunque esté estudiado bajo dos claves distintas en `data/`.
- **Prohibido** tener un lexicon sin fichero y un fichero sin lexicon a medias: si el archivo existe, está completo.

## 3. Cumplimiento de Esquema (Regla Suprema del Paquete)

- **Cada archivo YAML debe cumplir estrictamente** el JSON Schema `schemas/lexicon.schema.json` ubicado en la raíz del repositorio.
- **Prohibido** bajo ningún concepto:
  - Añadir campos o propiedades que no existan en el esquema.
  - Extender o modificar el esquema sin autorización expresa (ver `CONSTITUCION.md` → Regla 6.2).
- El archivo debe ser **válido YAML** y **legible**.
- **Sin tildes en los nombres de campo**: `mascara`, `traduccion`, `tipo_lectura`. Las tildes y la ñ solo aparecen en los valores y en los textos.

## 4. Definiciones Absolutas

- Todo término usado en este paquete debe seguir **exactamente** la definición establecida en `DEFINICIONES.md`.
- Especialmente obligatorias:
  - Definición de **Lexicon** (sección 6)
  - Definición de **Kanji** (sección 1)
  - Definición de **Solo Componente** (sección 2)
- El plural oficial del término es **lexicones** (ver `CONTEXT.md`). No se escribe *lexicons* ni *léxicos*.

## 5. Validación Semántica (Obligatoria)

Más allá del esquema, `.github/validar-lexicones.js` comprueba en cada Pull Request:

1. El `id` existe en `data/`.
2. El `id` **no** es un solo componente: los solo componentes no existen en la lengua y no pueden tener lexicon.
3. El nombre del archivo es exactamente `<id>.yaml`.
4. La familia tiene **un mínimo de 3 palabras**.
5. Cada `palabra` contiene literalmente el carácter `id`.
6. Ninguna palabra se repite dentro del mismo lexicon.
7. La `mascara` cuadra con `palabra` y `lectura`: tantos guiones como kana de la lectura y un punto menos que caracteres de palabra.
8. La `frase` marca el carácter de la familia como Referencia: `(id)`.
9. Toda Referencia de la `frase` lleva un solo carácter entre paréntesis y ese carácter existe en `data/`.

La misma comprobación 7 se aplica a los `ejemplos` de los grupos yomi, que usan la misma pauta y el mismo código de la web.

## 6. Relación con los ejemplos de los grupos yomi

- Un lexicon responde **«¿qué palabras contienen este kanji?»**; un ejemplo de grupo yomi responde **«¿qué comparten lectura estos kanji?»**.
- **Conviven sin cruzarse**: la misma palabra puede aparecer en los dos sitios y ninguna de las dos fuentes referencia a la otra.
- Corregir una lectura en un sitio **no** la corrige en el otro. Quien cambie una palabra debe buscarla también en el otro paquete.

## 7. Calidad del Contenido

- No se permiten errores de ortografía en castellano en `significado`, `traduccion` ni en ningún otro texto.
- `lectura` es la lectura de la palabra entera, en kana; `tipo_lectura` declara si es `on` o `kun`.
- `frase` va en japonés y `traduccion` en castellano. Ambas son obligatorias.
- El orden del array `palabras` es el **orden de presentación** al estudiante y lo decide quien redacta.

## 8. Skills Obligatorias del Paquete

**Skill oficial de validación:**
- **Nombre:** `validar-lexicon`
- **Ubicación:** `.opencode/skills/validar-lexicon/SKILL.md` (y su copia en `.copilot/skills/validar-lexicon/SKILL.md`)

**Uso obligatorio:**
Cualquier agente de IA que cree, modifique o revise archivos en este paquete **debe** aplicar primero la skill `validar-lexicon` antes de proponer cualquier cambio.

## 9. Comportamiento Obligatorio de las IAs

Cualquier agente de IA que trabaje en este paquete **debe**:

1. Leer primero `CONSTITUCION.md`, `DEFINICIONES.md` y este `RULES.md`.
2. Aplicar la skill `validar-lexicon` antes y después de cualquier generación y edición.
3. Verificar que cada archivo generado cumple el esquema antes de proponerlo.
4. Usar siempre la nomenclatura y la estructura exactas definidas aquí.
5. Rechazar cualquier petición que viole estas reglas citando la sección correspondiente.

---

*Single Source of Truth*
