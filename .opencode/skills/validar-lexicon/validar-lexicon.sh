#!/bin/bash
# Script de validación del paquete lexicon/lexicon/ compatible con el validador node.js del repo
# Uso:
#   .opencode/skills/validar-lexicon/validar-lexicon.sh
#
# Se ejecuta desde cualquier ubicación; calcula el root del repo.
# Exporta las variables de entorno necesarias y llama al validador node.js,
# que recorre la base entera: esquema, semántica de los lexicones y máscaras.

set -e

# Obtener el directorio root del repo (dos niveles arriba del script)
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ROOT_DIR="$( realpath "$SCRIPT_DIR/../../.." )"

# Configuración de rutas absolutas desde el root
export DATA_DIR="$ROOT_DIR/data/"
export META_DIR="$ROOT_DIR/meta-data/"
export YOMI_DIR="$ROOT_DIR/yomi/"
export KANA_DIR="$ROOT_DIR/kanas/"
export KANJI_HINT_DIR="$ROOT_DIR/lexicon/hints-kanji/"
export LEXICON_DIR="$ROOT_DIR/lexicon/lexicon/"
export EXCEPCIONES_DIR="$ROOT_DIR/lexicon/excepciones/"
export PROFILES_DIR="$ROOT_DIR/profiles/"

cd "$ROOT_DIR"

echo "Validando lexicones en: $LEXICON_DIR"
node .github/validar-schema.js
