#!/usr/bin/env zsh

OUTPUT_FILE="$1"

source "$(dirname "$0")/../config.sh"
previewPath="$(dirname "$0")/../preview.sh"

queryReloadPath="$(dirname "$0")/fzf_reload_by_query.sh"
queryFilesPath="$(dirname "$0")/query_files.sh"

fzf --phony --query "" \
    --delimiter ':' \
    --preview-window "+{2}-10" \
    --preview "source $previewPath && preview {1} {2}" \
    --bind "change:reload:(source $queryReloadPath && fzf_reload_by_query {q})" \
    --bind "start:reload:(source $queryFilesPath; query_files)" \
    --cycle \
    --bind "$KEYMAPPING" \
    --layout "$LAYOUT" \
    --multi | sed "s|^~/|$HOME/|" > "$OUTPUT_FILE"