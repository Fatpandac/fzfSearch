#!/usr/bin/env zsh
OUTPUT_FILE="$1"

source "$(dirname "$0")/../config.sh"

previewPath="$(dirname "$0")/preview.sh"

SCAN_PATHS=($(eval echo "$FZFSEARCH_REPO_PATH"))

repos=$(fd --type d --hidden --glob "*.git" "${SCAN_PATHS[@]}" 2>/dev/null | sed 's/\/\.git\/$//')

echo "$repos" | fzf \
    --preview "source $previewPath && preview {1}" \
    --cycle \
    --bind "enter:+execute-silent(echo {}:0 > $OUTPUT_FILE)+abort" \
    --bind "alt-enter:+execute-silent(echo {}:1 > $OUTPUT_FILE)+abort" \
    --bind "$KEYMAPPING" \
    --layout "$LAYOUT" || true