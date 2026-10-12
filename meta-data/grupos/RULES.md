# RULES.md

**Paquete:** `meta-data/grupos/`  
**Versión:** 1.0  
**Última actualización:** 2026-05-02  

**Single Source of Truth del paquete meta-data/grupos/**

Este fichero contiene las reglas específicas y obligatorias para todo el contenido del paquete `meta-data/grupos/`.  
**Debe respetar estrictamente** la jerarquía establecida en `CONSTITUCION.md` (Regla 3).

## 1. Ámbito de aplicación

Este `RULES.md` aplica a **todo** el paquete `meta-data/grupos/` y sus archivos YAML.

## 2. Estructura y Ubicación de Archivos (Obligatoria)

- Todos los grupos se definen **exclusivamente** como archivos YAML individuales.
- Ubicación exacta: carpeta `meta-data/grupos/`
- **Nomenclatura estricta de archivos:**
  - Formato: `id.yml`
  - Ejemplo: `amor.yml`, `naturaleza.yml`

## 3. Cumplimiento de Esquema (Regla Suprema del Paquete)

- **Cada archivo YAML debe cumplir estrictamente** el JSON Schema `schemas/grupo.schema.json` ubicado en la raíz del repositorio.
- **Prohibido** bajo cualquier contexto:
  - Añadir campos o propiedades que no existan en el esquema.
  - Extender o modificar el esquema sin autorización expresa (ver `CONSTITUCION.md` → Regla 6.2).
- El archivo debe ser **válido YAML** y **legible**.

## 4. Definiciones Absolutas

- Todo término usado en este paquete debe seguir **exactamente** la definición establecida en `DEFINICIONES.md` (sección 3 — Grupo).
- Especialmente obligatorios: `id`, `nombre`, `descripción`, `integrantes` y `auxiliares`.

## 5. Validaciones Semánticas (Obligatorias)

- Ningún kanji puede pertenecer a dos grupos (independientemente de si es integrante o auxiliar).
- Ningún kanji puede aparecer más de una vez dentro del mismo grupo.
- Todos los kanji referenciados deben existir previamente en el paquete `data/`.

## 6. Skills Obligatorias del Paquete

**Skill oficial de validación:**
- **Nombre:** `validar-grupo`
- **Ubicación:** `.opencode/skills/validar-grupo/SKILL.md` (y su copia en `.copilot/skills/validar-grupo/SKILL.md`)

**Regla obligatoria:**
Cualquier agente de IA que cree, modifique o revise archivos en este paquete **debe** aplicar primero la skill `validar-grupo` antes de proponer cualquier cambio.

## 7. Comportamiento Obligatorio de las IAs

Cualquier agente de IA que trabaje en este paquete **debe**:

1. Leer primero `CONSTITUCION.md`, este `RULES.md` y la skill `validar-grupo`.
2. Aplicar la skill `validar-grupo` antes y después de cualquier generación o edición.
3. Verificar que el archivo pasa **todas** las validaciones.
4. Rechazar cualquier propuesta que viole estas reglas citando la sección concreta.

---

*Single Source of Truth del paquete meta-data/grupos/*
