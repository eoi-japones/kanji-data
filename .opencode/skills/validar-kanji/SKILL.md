# SKILL: validar-kanji

**Nombre:** Validar Kanji  
**Paquete:** `data/`  
**Versión:** 1.1  
**Última actualización:** 2026-05-02  

**Single Source of Truth** para validar cualquier archivo de kanji o solo-componente en el paquete `data/`.

## Objetivo
Asegurar que cada fichero YAML de kanji (o solo-componente) cumple **al 100%** con:
- `CONSTITUCION.md` (especialmente Regla 6)
- `DEFINICIONES.md` (secciones 1 y 2 obligatorias)
- `data/RULES.md`
- Esquema JSON `schemas/kanji.schema.json`

## Proceso formal de validación

1. **Valida siempre usando el script bash oficial para garantizar variables de entorno correctas:**
   ```bash
   .opencode/skills/validar-kanji/validar-kanji.sh ruta/al/archivo.yml
   ```
   - Este script se encarga de exportar todas las variables necesarias y llamar automáticamente al validador node.js del repositorio.
   - Si el resultado da error → el archivo es inválido y debe corregirse (rechazar el cambio).
   - Si tu entorno o el comando falla por cuestiones técnicas ajenas al contenido, procede a validación manual obligatoria (ver abajo).

2. **Verifica manualmente que se respetan:**
   - Los campos y tipos definidos en `schemas/kanji.schema.json` (no debe haber campos extra ni faltar ninguno obligatorio).
   - Nomenclatura exacta: archivo `id,clave.yml`, en carpeta correcta (`data/`).
   - Uso exclusivo de términos definidos en `DEFINICIONES.md`.
   - Que la `historia` sea clara, pedagógica y en castellano correcto.
   - `solo_componente` debe ser 0 o 1 y estar correctamente asignado según definición.
   - El fichero NO debe violar ninguna regla de `data/RULES.md`.

3. **Si el archivo es conforme, la validación pasa. Si no, RECHAZAR explícitamente citando la regla violada.**

## Ejemplo de validación correcta
```yaml
id: 木
clave: árbol
historia: >
  Dibujo de un *árbol*. Le damos sentido de *madera* también.
componentes: []
como_componente:
  - árbol,木
  - madera,木
  - mástiles_de_madera,朩
solo_componente: 0
```

## Ejemplo de validación incorrecta
- Faltan campos obligatorios
- Se agregan campos extra
- `historia` tiene faltas de ortografía o es poco clara
- No cumple el esquema
- Campos de solo_componente mal asignados
- Nomenclatura incorrecta del archivo

## Referencias normativas
- Jerarquía de precedencia: `CONSTITUCION.md` > `DEFINICIONES.md` > `AGENTS.md` > `data/RULES.md` > Skill (esta)
- Cualquier conflicto o ambigüedad debe ser escalado conforme a la ley suprema del repositorio.

## Advertencia
**TODO CAMBIO QUE NO PASE ESTA VALIDACIÓN DEBE SER RECHAZADO AUTOMÁTICAMENTE Y NO PROPUESTO EN EL REPO.**

---
*Skill obligatoria para todo agente, IA o humano que opere en el paquete data/.*
