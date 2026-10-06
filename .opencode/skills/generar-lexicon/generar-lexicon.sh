#!/usr/bin/env bash
# Regenera los lexicones desde JMdict + KANJIDIC.
#
#   .opencode/skills/generar-lexicon/generar-lexicon.sh [--generar|--check]
#
# Sin argumento regenera (--generar). Ver
# docs/adr/0007-los-lexicones-se-generan-desde-jmdict.md.

set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)
cd "$ROOT_DIR"

export DATA_DIR="${DATA_DIR:-data}"
export META_DIR="${META_DIR:-meta-data}"
export LEXICON_DIR="${LEXICON_DIR:-lexicon/lexicon}"
export EXCEPCIONES_DIR="${EXCEPCIONES_DIR:-lexicon/excepciones}"

modo="${1:---generar}"

node .github/generar-lexicones.js "$modo"
