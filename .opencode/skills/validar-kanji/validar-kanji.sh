#!/bin/bash
# Script de validación para archivos kanji/data compatible con el validador node.js del repo
# Uso:
#   ./validar-kanji.sh <archivo-o-carpeta-kanji>
#
# Debe ejecutarse desde cualquier ubicación; calcula el root del repo.
# Exporta las variables de entorno necesarias y llama al validador node.js.

set -e

# Obtener el directorio root del repo (dos niveles arriba del script)
SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ROOT_DIR="$( realpath "$SCRIPT_DIR/../../.." )"

# Configuración de rutas absolutas desde el root
export DATA_DIR="$ROOT_DIR/data/"
export META_DIR="$ROOT_DIR/meta-data/"
export YOMI_DIR="$ROOT_DIR/yomi/"
export KANA_DIR="$ROOT_DIR/kana/"
export KANJI_HINT_DIR="$ROOT_DIR/lexicon/hints-kanji/"
export PROFILES_DIR="$ROOT_DIR/profiles/"

# Comprobar si hay argumento
if [ -z "$1" ]; then
  echo "Uso: $0 <archivo-o-carpeta-kanji>"
  exit 1
fi

KANJI_TARGET="$1"
# Si el argumento es relativo, resolver desde el cwd quien llama
if [[ "$KANJI_TARGET" != /* ]]; then
  KANJI_TARGET="$PWD/$KANJI_TARGET"
fi

# Llamada al validador node.js (siempre desde el root para que los requires relativos funcionen)
echo "Validando archivo/carpeta: $KANJI_TARGET"
echo "PWD antes de cd: $(pwd)"
echo "ROOT_DIR: $ROOT_DIR"
echo "Archivo a validar: $KANJI_TARGET"
cd "$ROOT_DIR"
echo "PWD tras cd: $(pwd)"
echo "Lanzando: node .github/validar-schema.js schemas/kanji.schema.json $KANJI_TARGET"
node .github/validar-schema.js schemas/kanji.schema.json "$KANJI_TARGET"
