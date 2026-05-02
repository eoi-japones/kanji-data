**Paquete:** `data/`  
**Versión:** 1.0  
**Última actualización:** 2026-05-02  

**Single Source of Truth del paquete data/**

Este fichero contiene las reglas específicas y obligatorias para todo el contenido del paquete `data/`.  
**Debe respetar estrictamente** la jerarquía establecida en `CONSTITUCION.md` (Regla 3).

## 1. Ámbito de aplicación

Este `RULES.md` aplica a **todo** el paquete `data/` y sus subcarpetas.

## 2. Estructura y Ubicación de Archivos (Obligatoria)

- Todos los kanji y solo componentes se definen **exclusivamente** como archivos YAML individuales.
- Ubicación exacta:
  - Kanji principales y Solo Componentes: carpeta `data/`
  - Solo Componentes adicionales (si se necesitan separar): carpeta `data/componentes/`
- **Nomenclatura estricta de archivos:**
  - Formato: `id,clave.yml`
  - Ejemplo: `愛,amor.yml` o `右,derecha.yml`

## 3. Cumplimiento de Esquema (Regla Suprema del Paquete)

- **Cada archivo YAML debe cumplir estrictamente** el JSON Schema `schemas/kanji.schema.json` ubicado en la raíz del repositorio.
- **Prohibido** bajo ningún concepto:
  - Añadir campos o propiedades que no existan en el esquema.
  - Extender o modificar el esquema sin autorización expresa (ver CONSTITUCION.md → Regla 6.2).
- El archivo debe ser **válido YAML** y **legible**.

## 4. Definiciones Absolutas

- Todo término usado en este paquete debe seguir **exactamente** la definición establecida en `DEFINICIONES.md`.
- Especialmente obligatorios:
  - Definición de **Kanji** (sección 1)
  - Definición de **Solo Componente** (sección 2)

## 5. Calidad del Contenido

- No se permiten errores de ortografía en castellano.
- La sección `historia` debe estar redactada de forma clara, coherente y pedagógica.
- Todo el contenido debe ser consistente con el enfoque educativo de la organización.

## 6. Comportamiento Obligatorio de las IAs

Cualquier agente de IA que trabaje en este paquete **debe**:

1. Leer primero `CONSTITUCION.md` y este `RULES.md`.
2. Verificar que cada archivo generado cumpla el esquema antes de proponerlo.
3. Usar siempre la nomenclatura y estructura exactas definidas aquí.
4. Rechazar cualquier petición que viole estas reglas citando la sección correspondiente.

---

*Single Source of Truth del paquete data/*
