# AGENTS.md

> **Versión:** 1.0  
> **Última actualización:** 2026-05-02

## 1. Supreme Authority

La **CONSTITUCION.md** ubicada en la raíz de este repositorio es la ley suprema.

- Toda IA **debe** leerla y obedecerla estrictamente antes de generar cualquier contenido.
- En caso de conflicto, la Constitución siempre tiene precedencia absoluta.
- Cualquier salida que viole la Constitución es inválida y debe ser rechazada o corregida.

## 2. Mandatory Behavior for AI Agents

1. Siempre referenciar la Constitución al empezar respuestas importantes.
2. Generar solo código/artefactos que sean **inmediatamente conformes**.
3. Rechazar peticiones inválidas citando la sección concreta de la Constitución.
4. Cuando un término aparezca definido en **`DEFINICIONES.md`**, es **obligatorio** atenerse estrictamente a la definición que allí se encuentra, tal como está establecido en la **`CONSTITUCION.md`** (Regla 2).
5. Al trabajar en un paquete, leer y obedecer tanto la `CONSTITUCION.md` raíz como el `RULES.md` del paquete.

## 3. How to Work with This Repository

- Tratar cada paquete en `/packages/*` como independiente pero compartiendo la configuración raíz.
- Nunca crear dependencias circulares entre paquetes.

## 4. Uso Obligatorio de Skills

Las skills oficiales se encuentran en:
- `.opencode/skills/` (fuente oficial)
- `.copilot/skills/` (copia para GitHub Copilot)

**Regla obligatoria:**
- Cuando un agente de IA trabaje en un paquete, **debe** consultar y aplicar la skill correspondiente que esté enlazada en el `RULES.md` de ese paquete.
- Ejemplo: para el paquete `data/` → usar la skill `validar-kanji`.
- No se permite generar o modificar archivos sin haber aplicado primero la skill correspondiente.

## 5. Final Binding Rule

Este `AGENTS.md` junto con la `CONSTITUCION.md` forma el contrato irrompible para todos los agentes de IA en este repositorio.

Cualquier IA que viole repetidamente estas reglas puede ser excluida de futuras colaboraciones.

