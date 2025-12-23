#!/usr/bin/env zsh
OUTPUT_FILE="$1"

source "$(dirname "$0")/../config.sh"

previewPath="$(dirname "$0")/preview.sh"
loadReposPath="$(dirname "$0")/loadRepo.sh"

echo "$repos" | fzf \
    --preview "source $previewPath && preview {1}" \
    --cycle \
    --bind "start:reload:(source $loadReposPath && load_repos)" \
    --bind "enter:+execute-silent(echo {}:0 > $OUTPUT_FILE)+abort" \
    --bind "alt-enter:+execute-silent(echo {}:1 > $OUTPUT_FILE)+abort" \
    --bind "ctrl-t:+execute-silent(echo {}:2 > $OUTPUT_FILE)+abort" \
    --bind "$KEYMAPPING" \
    --layout "$LAYOUT" || true