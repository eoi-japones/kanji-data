**Paquete:** `vocabulario/palabras-kana/`  
**Versión:** 1.0  
**Última actualización:** 2026-11-02  

**Single Source of Truth del paquete vocabulario/palabras-kana/**

Este fichero contiene las reglas específicas y obligatorias para todo el contenido del paquete `vocabulario/palabras-kana/`.  
**Debe respetar estrictamente** la jerarquía establecida en `CONSTITUCION.md` (Regla 3).

## 1. Ámbito de aplicación

Este `RULES.md` aplica a **todo** el paquete `vocabulario/palabras-kana/`.

## 2. Estructura y Ubicación de Archivos (Obligatoria)

- Cada palabra de kana se define **exclusivamente** como un archivo YAML individual.
- Ubicación exacta: carpeta `vocabulario/palabras-kana/`.
- **Nomenclatura estricta de archivos:**
  - Formato: `<nivel>_<seccion>_<palabra>.yml`.
  - Ejemplo: `a2.2_s3_きもの.yml`.
- El `id` del artefacto es `<nivel>/<seccion>/<palabra>`; los guiones bajos del nombre de fichero sustituyen a las barras del `id`.
- **Prohibido** tener un artefacto a medias: si el archivo existe, está completo.

## 3. Cumplimiento de Esquema (Regla Suprema del Paquete)

- **Cada archivo YAML debe cumplir estrictamente** el JSON Schema `schemas/palabra-kana.schema.json` ubicado en la raíz del repositorio.
- **Prohibido** bajo ningún concepto:
  - Añadir campos o propiedades que no existan en el esquema.
  - Extender o modificar el esquema sin autorización expresa (ver `CONSTITUCION.md` → Regla 6.2).
- El archivo debe ser **válido YAML** y **legible**.
- El YAML de origen **no** lleva el sobre `kind` ni `version`: los escribe el merge al publicar (ADR 0003).

## 4. Definiciones Absolutas

- Todo término usado en este paquete debe seguir **exactamente** la definición establecida en `DEFINICIONES.md` y en `CONTEXT.md`.
- La palabra de kana es una palabra del matome cuya lectura es íntegramente kana y que sirve de base al examen de kana. No es un kanji ni una ficha de kana.

## 5. Validación Semántica (Obligatoria)

Además del esquema, `.github/validar-palabras-kana.js` comprueba en cada Pull Request:

1. El nombre del archivo es exactamente `<nivel>_<seccion>_<palabra>.yml`.
2. El `id` casa con `nivel/seccion/palabra`.
3. No hay dos artefactos con el mismo `id`.
4. La `imagen` está bajo `/vocabulario/imagenes/<nivel>/<seccion>/`.

Las reglas del generador viven en `kanji-api` (`docs/palabras-kana.md`):

- solo entran palabras con lectura completa en kana y con ilustración;
- la imagen se publica siempre contra `https://guilliman-edu.github.io/v0-jp-web/`;
- el generador falla antes de escribir si hay un `id` duplicado o falta un dato obligatorio;
- la generación se limita a 150 palabras y reserva primero las que contienen katakana para que el examen conserve los dos silabarios.

## 6. Calidad del Contenido

- No se permiten errores de ortografía en castellano en `significado` ni en ningún otro texto.
- `palabra` es la lectura completa en kana; `forma_kanji` es la forma escrita y **no** se usa como lectura.
- `significado` es la glosa del matome, en castellano.
- Una palabra ocupa **una sola fila**: si el matome repite el mismo `id`, el generador falla en vez de elegir una.

## 7. Comportamiento Obligatorio de las IAs

Cualquier agente de IA que trabaje en este paquete **debe**:

1. Leer primero `CONSTITUCION.md`, `DEFINICIONES.md`, `CONTEXT.md` y este `RULES.md`.
2. Verificar que cada archivo generado cumple el esquema antes de proponerlo.
3. Usar siempre la nomenclatura y la estructura exactas definidas aquí.
4. Rechazar cualquier petición que viole estas reglas citando la sección correspondiente.

---

*Single Source of Truth*
