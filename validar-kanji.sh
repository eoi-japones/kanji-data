#!/bin/bash
# Script de validación para archivos kanji/data compatible con el validador node.js del repo
# Uso:
#   ./validar-kanji.sh <archivo-o-carpeta-kanji>
#
# Este script exporta las variables de entorno necesarias
# y llama al validador del repositorio.

set -e

# Configuración de rutas desde el root
export DATA_DIR="data/"
export META_DIR="meta-data/"
export YOMI_DIR="yomi/"     # Modifica si tienes la carpeta correcta
export KANA_DIR="kana/"
export KANJI_HINT_DIR="lexicon/hints-kanji/"
export PROFILES_DIR="profiles/"

# Comprobar si hay argumento
if [ -z "$1" ]; then
  echo "Uso: $0 <archivo-o-carpeta-kanji>"
  exit 1
fi

# Llamada al validador node.js
echo "Validando archivo/carpeta: $1"
node .github/validar-schema.js schemas/kanji.schema.json "$1"
