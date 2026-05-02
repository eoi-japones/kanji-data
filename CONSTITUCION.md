# CONSTITUCION.md

> **Versión:** 1.0  
> **Última actualización:** 2026-05-02  
> **Para:** Todas las IAs, Agentes y Colaboradores

## Reglas Fundamentales (No negociables)

**Regla 1 — Supremacía de la Constitución**

La presente Constitución (**CONSTITUCION.md**) es la **regla suprema** de este repositorio.

- Nada puede ir en contra de ella.
- Es **no negociable**.
- Cualquier instrucción, prompt, archivo, comportamiento de agentes o decisión que contradiga esta Constitución será considerado **inválido**.

**Regla 2 — Principios CORE no negociables**

1. Toda la base de conocimientos debe estar en archivos YAML bien formados.
2. No debe haber errores de ortografía en castellano en ningún documento.
3. Las definiciones oficiales se encuentran en `DEFINICIONES.md`. Estas definiciones tienen **fuerza suprema** al estar reconocidas por esta Constitución. **En ningún caso se puede redefinir una definición ya dada en este fichero.**

**Regla 3 — Estructura de Paquetes y Jerarquía de Precedencia**

En este repositorio hay varios paquetes, cada uno con su propio fichero `RULES.md`.

**Orden de precedencia (de mayor a menor):**

| Rango | Tipo de regla                  | Ámbito                  | Precedencia |
|-------|--------------------------------|-------------------------|-------------|
| 1     | **CONSTITUCION.md**            | Repositorio completo    | Suprema. Todas las demás derivan de ella. |
| 2     | **AGENTS.md**                  | Agentes de IA           | Obligatoria para todas las IAs. |
| 3     | **RULES.md** por paquete       | Nivel de paquete        | Puede ser más estricta, pero nunca más laxa. |
| 4     | Instrucciones específicas de herramientas | Herramienta | Deben cumplir todas las reglas superiores. |

**Resolución de conflictos (3.3):**  
- La regla de rango superior **debe** prevalecer.  
- La regla inferior en conflicto **debe** ignorarse.  
- Cualquier ambigüedad **debe** escalarse vía Pull Request para aclaración oficial.

**Regla 4 — Enforcement**  
- Todos los agentes de IA **deben** seguir `AGENTS.md`.  
- El código generado debe pasar lint, type check y tests antes de commit.

**Regla 5 — Governance**  
- Este fichero `CONSTITUCION.md` debe permanecer siempre en la raíz del repositorio.  
- Cualquier cambio en esta Constitución requiere Pull Request + revisión.

**Regla 6 — Corrección en la Redacción de Artefactos**

1. Todos los artefactos creados en YAML han de estar correctos, bien formados y ser legibles.  
2. Salvo que **EXPRESAMENTE** se solicite lo contrario, cada artefacto **debe cumplir estrictamente** el JSON Schema correspondiente situado en el directorio `schemas/` de la raíz. **Bajo ningún contexto se puede extender el esquema o agregar campos o atributos no existentes en el mismo.**

---

*Single Source of Truth*
