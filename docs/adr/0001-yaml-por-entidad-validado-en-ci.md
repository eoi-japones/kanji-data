# La base de conocimiento se almacena como un fichero YAML por entidad y se valida con JSON Schema en CI

El repositorio tiene que poder ser editado por personas que no programan, con revisión humana de cada cambio y con historial completo. Por eso cada kanji, kana, grupo, itinerario, colaborador, pista y perfil es un fichero YAML individual bajo su carpeta, con una forma fijada por el JSON Schema correspondiente de `schemas/`, y la validación se ejecuta automáticamente en cada Pull Request antes de fusionarse.

## Estado

**aceptado**

## Opciones consideradas

- **Base de datos**: descartada. Perdería la revisión por Pull Request, el historial por fichero y la edición directa desde el formulario web que genera el YAML y lo deja listo para subir.
- **Un único fichero grande por tipo**: descartada. Cada aportación tocaría el mismo fichero, con conflictos constantes y una lectura de diffs inútil.
- **CSV o JSON directo**: descartada. No admite comentarios, ni historias multilínea cómodas, ni la corrección de una sola historia por alguien que no programa.

## Consecuencias

- La unidad de revisión es el fichero, no la fila: se puede discutir una historia concreta en una Pull Request sin arrastrar el resto de la base.
- `CONSTITUCION.md` Regla 6.2 prohíbe extender un esquema, por lo que añadir un campo a una entidad exige cambiar primero el esquema en la raíz y pasar por Pull Request.
- No hay `package.json` versionado (`package.*` está en `.gitignore`), así que las dependencias de validación se instalan en cada ejecución de CI sin versión fijada.
