# SKILL: kanji-pr

**Nombre:** Submit Kanji PR (Conventional Commits)  
**Paquete:** `data/`  
**Versión:** 1.1  
**Última actualización:** 2026-05-02  

**Single Source of Truth** para crear Pull Requests con cambios en el paquete `data/` respetando **Conventional Commits**.

Esta skill **solo se ejecuta** después de haber completado la skill `kanji-lifecycle`.

## 1. Objetivo

Crear una Pull Request limpia, profesional y que cumpla con el estándar **Conventional Commits** cuando se:
- Crean nuevos kanji / solo-componentes
- Modifican kanji existentes
- Eliminan kanji / solo-componentes

## 2. Requisitos previos (obligatorios)

Antes de usar esta skill **debe** haberse completado:
- Skill `kanji-lifecycle` completa
- Validación con `validar-kanji`
- Todos los cambios deben estar staged (`git add`)

## 3. Conventional Commits (Regla Obligatoria)

**Formato de commit obligatorio:**

**Tipos recomendados para este paquete:**

| Tipo      | Uso                                      | Ejemplo                                    |
|-----------|------------------------------------------|--------------------------------------------|
| `feat`    | Crear nuevo kanji o solo-componente     | `feat(kanji): add 愛 (ai)`                 |
| `fix`     | Corregir error en un kanji               | `fix(kanji): correct history of 日 (hi)`   |
| `docs`    | Cambios en historia, descripción, etc.   | `docs(kanji): improve story of 学 (gaku)`  |
| `chore`   | Eliminación o tareas de mantenimiento    | `chore(kanji): remove obsolete ⿰`         |
| `style`   | Correcciones de formato u ortografía     | `style(kanji): fix spelling in historia`   |
| `refactor`| Refactorización sin cambio funcional     | `refactor(kanji): reorganize fields`       |

**Regla estricta:**  
Cualquier commit que no siga este formato **será rechazado** por la IA.

## 4. Naming Conventions

- **Nombre de rama:** `kanji/<id>-<clave>-<tipo>`  
  Ejemplos: `kanji/愛-ai-feat`, `kanji/日-hi-fix`, `kanji/⿰-left-right-chore`

- **Título de la PR:** Igual que el mensaje del commit.

## 5. Pasos Obligatorios de la PR

1. Crear rama con formato correcto.
2. Hacer commit usando **Conventional Commits**.
3. Ejecutar validación final con `validar-kanji`.
4. Crear la Pull Request.
5. En la descripción del PR incluir:
   - Checklist de `kanji-lifecycle`
   - Resultado de `validar-kanji`
   - Enlace a las skills utilizadas (`kanji-lifecycle` y `kanji-pr`)

## 6. Reglas No Negociables (CONSTITUCION.md)

- **Nunca** se permite abrir una PR sin seguir Conventional Commits.
- **Nunca** se permite saltarse la validación de `validar-kanji`.
- La IA **debe rechazar** cualquier petición que intente usar un formato de commit diferente.

---

