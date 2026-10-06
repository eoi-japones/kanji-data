# SKILL: generar-lexicon

**Nombre:** Generar Lexicon
**Paquete:** `lexicon/lexicon/`
**Versión:** 1.0
**Última actualización:** 2026-10-05

**Single Source of Truth** para regenerar y redactar los lexicones.

## Objetivo

Mantener los lexicones completos y reproducibles: la parte determinista deriva el
vocabulario de JMdict filtrado al inventario de `data/`, y esta skill redacta los
campos de idioma (`significado`, `frase`, `traduccion`) que la máquina no inventa.

Decisiones de fondo en `docs/adr/0007-los-lexicones-se-generan-desde-jmdict.md`.

## Proceso

1. **Regenerar y obtener la lista de trabajo:**

   ```bash
   node .github/generar-lexicones.js --generar
   ```

   Deja en `lexicon/pendientes.json` las palabras nuevas con sus glosas de JMdict.
   El paquete `lexicon/lexicon/` no se toca a medias: un fichero solo se escribe
   completo.

2. **Redactar cada palabra pendiente** rellenando en `lexicon/pendientes.json`:

   - `significado`: en castellano, a partir de las `glosas` (en inglés). Si hay
     varias acepciones, las más comunes primero y separadas por coma, en el estilo
     del repo («Lectura, lecturar»). No inventar acepciones.
   - `frase`: una frase japonesa corta (N5–N4) que contenga la palabra. **Sin**
     marcar el kanji de la familia: lo hace el generador al ensamblar.
   - `traduccion`: la traducción de la frase, en castellano.

3. **Ensamblar:**

   ```bash
   node .github/generar-lexicones.js --generar
   ```

   Conserva lo ya redactado, incorpora lo nuevo y elimina las palabras que salen
   del universo.

4. **Validar:**

   ```bash
   node .github/generar-lexicones.js --check
   .opencode/skills/validar-lexicon/validar-lexicon.sh
   ```

## Reglas

- Solo entran palabras cuya grafía principal use kanji presentes en `data/` y al
  menos uno no solo-componente. No hay umbral de frecuencia.
- El orden de `palabras` lo fija la frecuencia de uso; no lo reordenes a mano.
- No edites a mano `lectura`, `tipo_lectura` ni `mascara`: son deterministas. Si
  un reparto es incorrecto, fíjalo en `lexicon/excepciones/excepciones.yaml`.
- Un kanji con menos de 2 palabras elegibles no tiene lexicon.
- Ortografía impecable en castellano: la exige `CONSTITUCION.md` Regla 2.2.

## Referencias

- `docs/adr/0007-los-lexicones-se-generan-desde-jmdict.md`
- `docs/adr/0008-minimo-de-dos-palabras-por-lexicon.md`
- `lexicon/lexicon/RULES.md`
- `.opencode/skills/validar-lexicon/SKILL.md`

---

*Skill obligatoria para regenerar el paquete `lexicon/lexicon/`.*
