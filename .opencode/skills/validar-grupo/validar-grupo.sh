#!/bin/bash
# =============================================
# validar-grupo.sh
# Comando oficial para validar archivos de Grupo
# =============================================

set -e

# Obtener directorio raiz del repo
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ROOT_DIR="$( realpath "$SCRIPT_DIR/../../.." )"

# Exportar rutas relevantes como variables de entorno absolutas
export DATA_DIR="$ROOT_DIR/data/"
export META_DIR="$ROOT_DIR/meta-data/"
export YOMI_DIR="$ROOT_DIR/meta-data/itinerarios-yomi/"
export KANA_DIR="$ROOT_DIR/kana/"
export KANJI_HINT_DIR="$ROOT_DIR/lexicon/hints-kanji/"
export PROFILES_DIR="$ROOT_DIR/profiles/"

if [ "$#" -eq 0 ]; then
  echo "Uso: $0 <ruta-al-archivo-grupo.yml>"
  echo "Ejemplo: $0 meta-data/grupos/amor.yml"
  exit 1
fi

GROUP_FILE="$1"
# Si la ruta es relativa, resolver desde el cwd quien llama
if [[ "$GROUP_FILE" != /* ]]; then
  GROUP_FILE="$PWD/$GROUP_FILE"
fi

SCHEMA="$ROOT_DIR/schemas/grupo.schema.json"

cd "$ROOT_DIR"
echo "🔍 Validando Grupo de Kanji"
echo "📄 Archivo  : $GROUP_FILE"
echo "📐 Esquema  : $SCHEMA"
echo "────────────────────────────────────"

echo "→ Ejecutando validación de esquema..."
node .github/validar-schema.js "$SCHEMA" "$GROUP_FILE"

echo ""
echo "→ Ejecutando validación semántica de grupos..."
node -e '
  const { validarGrupos } = require("./.github/validar-grupos.js");
  const fs = require("fs");
  const path = require("path");
  const gruposDir = "meta-data/grupos";
  const kanjisDir = "data";
  const grupos = {};
  fs.readdirSync(gruposDir).forEach(file => {
    if (file.endsWith(".yml")) {
      const content = fs.readFileSync(path.join(gruposDir, file), "utf8");
      const yaml = require("js-yaml").load(content);
      grupos[yaml.id] = yaml;
    }
  });
  const kanjis = {};
  fs.readdirSync(kanjisDir).forEach(file => {
    if (file.endsWith(".yml")) {
      const content = fs.readFileSync(path.join(kanjisDir, file), "utf8");
      const yaml = require("js-yaml").load(content);
      kanjis[yaml.id] = yaml;
    }
  });
  validarGrupos(grupos, kanjis);
  console.log("✅ Validación semántica completada correctamente.");
'
echo ""
echo "✅ ¡Grupo validado correctamente! Cumple tanto el esquema como todas las reglas semánticas de DEFINICIONES.md y CONSTITUCION.md."
