# SKILL: validar-lexicon

**Nombre:** Validar Lexicon  
**Paquete:** `lexicon/lexicon/`  
**Versión:** 1.0  
**Última actualización:** 2026-10-03  

**Single Source of Truth** para validar cualquier archivo de lexicon del paquete `lexicon/lexicon/`.

## Objetivo
Asegurar que cada fichero YAML de lexicon cumpla **al 100%** con:
- `CONSTITUCION.md` (especialmente Reglas 2 y 6)
- `DEFINICIONES.md` (sección 6, Lexicon, obligatoria)
- `lexicon/lexicon/RULES.md`
- Esquema JSON `schemas/lexicon.schema.json`

## Proceso formal de validación

1. **Valida siempre usando el script bash oficial para garantizar variables de entorno correctas:**
   ```bash
   .opencode/skills/validar-lexicon/validar-lexicon.sh
   ```
   - Este script exporta todas las variables necesarias y llama al validador node.js del repositorio.
   - Si el resultado da error → el archivo es inválido y debe corregirse (rechazar el cambio).
   - Si tu entorno o el comando falla por cuestiones técnicas ajenas al contenido, procede a validación manual obligatoria (ver abajo).

2. **Verifica manualmente que se respetan:**
   - Los campos y tipos de `schemas/lexicon.schema.json` (no debe haber campos extra ni faltar ninguno obligatorio).
   - Nomenclatura exacta: archivo `<id>.yaml`, en la carpeta `lexicon/lexicon/`.
   - El `id` existe en `data/` y **no** es un solo componente.
   - Un mínimo de **2 palabras**, cada una conteniendo literalmente el carácter `id`.
   - Ninguna palabra repetida dentro del mismo lexicon.
   - La `mascara` cuadra: tantos guiones como kana de la `lectura` y un punto menos que caracteres de la `palabra`.
   - La `frase` marca el carácter de la familia: `(id)`, y toda Referencia lleva un solo carácter que exista en `data/`.
   - `tipo_lectura` es `on` o `kun`; `significado` y `traduccion` en castellano correcto, sin errores ortográficos.
   - Nombres de campo **sin tildes**: `mascara`, `traduccion`, `tipo_lectura`.
   - Uso exclusivo de términos definidos en `DEFINICIONES.md` y `CONTEXT.md`.

3. **Si el archivo es conforme, la validación pasa. Si no, RECHAZAR explícitamente citando la regla violada.**

## Ejemplo de validación correcta
```yaml
id: 読
palabras:
  - palabra: 読む
    lectura: よむ
    tipo_lectura: kun
    significado: Leer
    mascara: '-.-'
    frase: 毎朝、新聞を(読)む。
    traduccion: Cada mañana leo el periódico.
  - palabra: 読書
    lectura: どくしょ
    tipo_lectura: on
    significado: Lectura, lecturar
    mascara: '--.--'
    frase: 駅で本を(読)書する。
    traduccion: Leo un libro en la estación.
  - palabra: 読者
    lectura: どくしゃ
    tipo_lectura: on
    significado: Lector
    mascara: '--.--'
    frase: この(読)者は有名な小説家だ。
    traduccion: Este lector es un novelista famoso.
```

## Ejemplo de validación incorrecta
- Faltan campos obligatorios o sobran campos que no están en el esquema.
- El archivo se llama `leer.yaml` en vez de `読.yaml`.
- Hay menos de dos palabras, o una palabra no contiene el carácter de la familia.
- La máscara lleva un guion de más o un punto de menos.
- La frase no marca `(id)`, o una Referencia apunta a un carácter que no existe en `data/`.
- Un solo componente tiene lexicon.
- Faltas de ortografía en `significado` o `traduccion`.

## Referencias normativas
- Jerarquía de precedencia: `CONSTITUCION.md` > `DEFINICIONES.md` > `AGENTS.md` > `lexicon/lexicon/RULES.md` > Skill (esta)
- Cualquier conflicto o ambigüedad debe ser escalado conforme a la ley suprema del repositorio.

## Advertencia
**TODO CAMBIO QUE NO PASE ESTA VALIDACIÓN DEBE SER RECHAZADO AUTOMÁTICAMENTE Y NO PROPUESTO EN EL REPO.**

---
*Skill obligatoria para todo agente, IA o humano que opere en el paquete lexicon/lexicon/.*
