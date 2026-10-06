# El mínimo de un lexicon baja de tres a dos palabras

`DEFINICIONES.md` §6 y `lexicon.schema.json` exigen un mínimo de tres palabras por familia. Un kanji que solo alcanza dos palabras elegibles en JMdict se quedaría sin lexicon aunque tenga familia real. Se baja el mínimo a dos.

## Estado

**aceptado**

## Opciones consideradas

- **Mantener tres**: descartada. Deja fuera del lexicon a kanji con familia de exactamente dos palabras.
- **Completar con palabras de fuera del inventario**: descartada. Rompe el universo fijado en el ADR 0007.
- **Bajar el mínimo a uno**: descartada. Un lexicon de una sola palabra no es una familia.

## Consecuencias

- Cambia una definición de `DEFINICIONES.md` §6, que la `CONSTITUCION.md` Regla 2.3 declara con fuerza suprema e irredefinible. La enmienda es deliberada y debe ir por Pull Request (Regla 5); este ADR la deja por escrito.
- Hay que actualizar, en el mismo cambio: `DEFINICIONES.md` §6, `schemas/lexicon.schema.json` (`minItems`), `lexicon/lexicon/RULES.md` §5.4 y el texto de la skill `validar-lexicon`. El validador `.github/validar-lexicones.js` no comprueba el mínimo —lo hace el esquema—, pero conviene alinearlo.
- `読.yaml` ya cumple; no hay migración de datos.
