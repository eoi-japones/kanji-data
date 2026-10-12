# SKILL: validar-grupo

**Nombre:** Validar Grupo  
**Paquete:** `meta-data/grupos/`  
**Versión:** 1.1  
**Última actualización:** 2026-05-02  

**Single Source of Truth** para validar cualquier archivo de grupo.

Esta skill **debe ser aplicada obligatoriamente** por cualquier agente de IA antes de crear, modificar o revisar un grupo.

## 1. Objetivo
Validar que un fichero YAML de grupo cumple **al 100%** con:
- `CONSTITUCION.md` (Regla 6)
- `DEFINICIONES.md` (sección 3 — Grupo)
- `meta-data/grupos/RULES.md`
- Esquema JSON `schemas/grupo.schema.json`
- **Validación semántica completa** (definida en `.github/validar-grupos.js`)

## 2. Reglas obligatorias de validación

1. **Validación contra esquema**
2. **Validación semántica** (ningún kanji repetido, ningún kanji en dos grupos, existencia de kanjis, etc.)

## 3. Comando oficial de validación

Usar siempre el script oficial de la skill:

```bash
# Validación de un grupo concreto
.opencode/skills/validar-grupo/validar-grupo.sh meta-data/grupos/id.yml

# Validación de todos los grupos (recomendado antes de PR)
find meta-data/grupos -name "*.yml" -exec .opencode/skills/validar-grupo/validar-grupo.sh {} \;
```

## 4. Comportamiento de la IA

Cuando se use esta skill:

- Siempre ejecutar el comando validar-grupo.sh antes y después de cualquier cambio.
- Si falla cualquier comprobación (esquema o semántica) → rechazar la propuesta y citar la regla exacta de la Constitución o DEFINICIONES.md.
- Solo aceptar el archivo cuando pase todas las validaciones.

## 5. Reglas No Negociables

- Nunca se permite proponer un grupo sin haber ejecutado validar-grupo.sh.
- La IA debe rechazar cualquier petición que intente saltarse esta validación.


---
*Skill obligatoria para todo agente, IA o humano que opere en el paquete meta-data/grupos/.*
