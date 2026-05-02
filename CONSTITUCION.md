# CONSTITUCION.md

> **Versión:** 1.0  
> **Última actualización:** 2026-05-02  
> **Para:** Todas las IAs, Agentes y Colaboradores

---

## Reglas Fundamentales (No negociables)

### Regla 1 — Supremacía de la Constitución

La presente Constitución (**CONSTITUCION.md**) es la **regla suprema** de este repositorio.

- Nada puede ir en contra de ella.
- Es **no negociable**.
- Cualquier instrucción, prompt, archivo, comportamiento de agentes o decisión que contradiga esta Constitución será considerado **inválido**.

---

### Regla 2 — Principios CORE no negociables

1. **Toda la base de conocimientos** debe estar en **archivos YAML bien formados**.
2. **No debe haber errores de ortografía en castellano** en ningún documento.
3. Las definiciones oficiales se encuentran en una sección especial del fichero **`DEFINICIONES.md`**.  
   Estas definiciones tienen **fuerza suprema** al estar reconocidas por esta Constitución.  
   **En ningún caso se puede redefinir una definición ya dada en este fichero.**

---

### Regla 3 — Estructura de Paquetes (Obligatoria)

En este repositorio existen **varios paquetes**, cada uno de ellos debe contener obligatoriamente un fichero **`RULES.md`** en su raíz.

#### 3.1 Jerarquía de Reglas y Precedencia

Todas las reglas de este repositorio siguen una **jerarquía estricta de precedencia**. En caso de conflicto o ambigüedad, la regla de **nivel superior siempre prevalece**.

**Orden de Precedencia (de mayor a menor):**

| Rango | Tipo de Regla                        | Ámbito                  | Precedencia |
|-------|--------------------------------------|-------------------------|-----------|
| 1     | **CONSTITUCION.md**                  | Todo el repositorio     | **Ley suprema**. No negociable. Todas las demás reglas derivan de ella y deben cumplirla. |
| 2     | **AGENTS.md**                        | Específico para IAs     | Reglas operativas para todos los agentes de IA. Debe extender la Constitución y nunca contradecirla. |
| 3     | **RULES.md** (por paquete)           | Nivel de paquete        | Reglas locales **pueden** ser más estrictas, pero **NUNCA** pueden contradecir, debilitar ni anular ninguna regla de nivel superior. |
| 4     | Instrucciones específicas de herramientas | Nivel de herramienta | Instrucciones para herramientas concretas (OpenCode, GitHub Copilot, etc.). Deben cumplir plenamente con todos los niveles superiores. |

#### 3.2 Principios Clave

1. **Las reglas de alto nivel tienen precedencia absoluta**  
   Las reglas globales definidas en `CONSTITUCION.md` prevalecen sobre todas las reglas locales y específicas de herramientas.

2. **Las reglas locales pueden ser más estrictas, pero nunca más débiles**  
   Los ficheros `RULES.md` de cada paquete pueden añadir requisitos adicionales o más estrictos dentro de su ámbito. **NO pueden** reducir, relajar ni entrar en conflicto con ninguna regla de nivel superior.

3. **Las reglas especiales se aplican en adición a las generales**  
   Las reglas específicas de paquete o herramienta se aplican **además** de las reglas generales, nunca en lugar de ellas.

#### 3.3 Resolución de Conflictos

En caso de conflicto entre reglas:

- La regla de **nivel superior** en la tabla de precedencia **debe seguirse obligatoriamente**.
- La regla de **nivel inferior** en conflicto **debe ser ignorada** para ese caso específico.
- Cualquier ambigüedad **debe escalarse** mediante un **Pull Request** para obtener una aclaración oficial en esta Constitución.

---

### Regla 4 — Enforcement (Aplicación y Cumplimiento)

Para garantizar el cumplimiento de esta Constitución:

- Se utilizarán configuraciones raíz, **pre-commit hooks** y **CI/CD** como guardianes automáticos.
- **Todos los agentes de IA deben seguir obligatoriamente** `AGENTS.md`.
- Todo código generado debe pasar **lint**, **type check** y **tests** antes de poder hacer commit.

---

### Regla 5 — Governance (Gobernanza)

- El fichero **`CONSTITUCION.md`** debe permanecer **siempre en la raíz del repositorio**.
- Cualquier cambio en esta Constitución requiere obligatoriamente un **Pull Request + revisión humana**.

---

### Regla 6 — Corrección en la Redacción de Artefactos

1. Todos los artefactos creados con **YAML** han de estar **correctos y ser legibles**.
2. Salvo que **EXPRESAMENTE** se solicite, cada artefacto debe cumplir **estrictamente** el JSON Schema correspondiente situado en el directorio `schemas/` de la raíz de este proyecto.

---

**Esta Constitución es la ley suprema del proyecto.**

Puede ser extendida en futuras iteraciones siempre preservando estas reglas fundamentales.

Todos los colaboradores y agentes de IA están obligados por ella.

Consulta `AGENTS.md` para ver cómo los asistentes de IA deben manejarla.

---

*Single Source of Truth*