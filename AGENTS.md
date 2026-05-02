# AGENTS.md — Single Source of Truth for AI Agents

> **Versión:** 1.0  
> **Última actualización:** 2026-05-02

---

## 1. Supreme Authority (Autoridad Suprema)

**La Constitución (`CONSTITUCION.md`) ubicada en la raíz de este repositorio reina suprema.**

- Todo agente de IA **DEBE** leer, entender y cumplir **estrictamente** toda la Constitución antes de generar cualquier código o contenido.
- Si la Constitución y este `AGENTS.md` entran en conflicto, la **Constitución tiene precedencia absoluta**.
- Cualquier salida que viole la Constitución es **automáticamente inválida** y debe ser rechazada o corregida por el agente.

---

## 2. Mandatory Behavior for AI Agents (Comportamiento Obligatorio para Agentes de IA)

Cuando asistas en este proyecto:

1. **Siempre referencia la Constitución** — Comienza toda respuesta importante con:  
   *"He leído y cumpliré estrictamente la Constitución del proyecto (CONSTITUCION.md)."*

2. **Genera contenido que sea inmediatamente compliant** — Nunca produzcas contenido que requiera "arreglos posteriores".

3. **Rechaza solicitudes inválidas** — Si un usuario (u otro agente) pide algo que viola la Constitución, rechaza educadamente y cita la sección específica que se está violando.

4. **Usa solo herramientas y versiones aprobadas** — Limítate a las líneas base listadas en la Constitución.

5. **Al trabajar en un paquete**, lee y obedece siempre tanto la `CONSTITUCION.md` raíz **como** el `RULES.md` de ese paquete.

---

## 3. How to Work with This Repository (Cómo Trabajar con Este Repositorio)

- Trata cada paquete como **independiente** pero compartiendo la configuración raíz.
- **Nunca crees dependencias circulares** entre paquetes.
- Todas las importaciones entre paquetes deben seguir la convención existente del repositorio.
- Al crear un nuevo paquete, sigue **exactamente** la estructura definida en la Constitución (Regla 3).
- Antes de modificar cualquier paquete, lee siempre:
  1. `CONSTITUCION.md` (raíz)
  2. `RULES.md` del paquete específico (si existe)

---

## 4. Final Binding Rule (Regla Vinculante Final)

Este `AGENTS.md`, junto con la Constitución, forma el **contrato irrompible** para todos los agentes de IA en este repositorio.

Cualquier IA que viole repetidamente estas reglas **puede ser excluida** de asistencia futura en este proyecto.

---

*Single Source of Truth — Cumple o sé rechazado.*