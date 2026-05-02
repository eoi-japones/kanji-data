# SKILL: kanji-lifecycle

**Nombre:** Lifecycle de un Kanji  
**Paquete:** `data/`  
**Versión:** 1.0  
**Última actualización:** 2026-05-02  

**Single Source of Truth** para crear o modificar cualquier kanji o solo-componente.

Esta skill **debe ser aplicada obligatoriamente** por cualquier agente de IA antes de generar o editar un archivo en el paquete `data/`.

## 1. Objetivo
Garantizar que **todo** kanji o solo-componente sigue estrictamente:
- `CONSTITUCION.md` (todas las reglas, especialmente Regla 6)
- `DEFINICIONES.md` (secciones 1 y 2)
- `data/RULES.md`
- Skill `validar-kanji`
- Esquema `schemas/kanji.schema.json`

## 2. Lifecycle Obligatorio (pasos secuenciales)

Cualquier agente de IA **debe** seguir este orden exacto:

### Paso 1 – Recepción y Análisis de la Petición
- Leer la petición del usuario.
- Identificar si es **creación** o **modificación**.
- Extraer los datos requeridos: `id`, `clave`, `historia`, `solo_componente` (si aplica).

### Paso 2 – Verificación de Definiciones Absolutas
- Comprobar que se usan **exactamente** las definiciones de `DEFINICIONES.md` (Kanji y Solo Componente).
- Rechazar cualquier desviación.

### Paso 3 – Aplicar Skill de Validación Previa
- Ejecutar la skill `validar-kanji` (aunque el archivo aún no exista, validar la estructura propuesta).

### Paso 4 – Generación / Modificación del Archivo
- Crear o editar el archivo siguiendo **exactamente**:
  - Nomenclatura: `id, clave.yml`
  - Ubicación: `data/` (o `data/componentes/` si es solo-componente)
  - Cumplimiento estricto del esquema `schemas/kanji.schema.json`
- No añadir campos extra (Regla 6.2 de CONSTITUCION.md).

### Paso 5 – Validación Completa Post-Generación
- Ejecutar la skill `validar-kanji` sobre el archivo generado.
- Comprobar:
  - YAML válido y legible
  - Cumplimiento del JSON Schema
  - Nomenclatura correcta
  - Definiciones absolutas respetadas
  - Ortografía correcta en castellano

### Paso 6 – Propuesta Final
- Solo proponer el cambio si **pasa todas las validaciones**.
- Incluir en el PR o comentario:
  - Checklist del lifecycle completado
  - Resultado de la validación
  - Enlace a esta skill

## 3. Reglas No Negociables

- **Nunca** saltar ningún paso del lifecycle.
- **Nunca** generar un archivo sin haber ejecutado la skill `validar-kanji`.
- Si cualquier paso falla → rechazar la petición y citar la sección exacta de la Constitución o RULES.md.
- El orden de los pasos **es relevante** (no se puede validar después de proponer).

## 4. Comandos recomendados

```bash
# Validación previa (estructura)
.opencode/skills/validar-kanji/validate-kanji.sh "propuesta"

# Validación final del archivo
.opencode/skills/validar-kanji/validate-kanji.sh data/愛, ai.yml
