#!/usr/bin/env zsh

OUTPUT_FILE="$1"
searchPaths=($(eval echo "$FZFSEARCH_SEARCH_PATHS"))

source "$(dirname "$0")/../config.sh"
previewPath="$(dirname "$0")/../preview.sh"

queryReloadPath="$(dirname "$0")/fzf_reload_by_query.sh"
queryFilesPath="$(dirname "$0")/query_files.sh"

selected=$(
fzf --phony --query "" \
  --delimiter ':' \
  --preview-window "+{2}-10" \
  --preview "source $previewPath && preview {1} {2}" \
  --bind "change:reload:(source $queryReloadPath && fzf_reload_by_query {q})" \
  --bind "start:reload:(source $queryFilesPath; query_files)" \
  --cycle \
  --bind "$KEYMAPPING" \
  --layout "$LAYOUT" \
  --multi
)

absolute_files=""
echo "$selected" | while read -r file; do
  for dir in "${searchPaths[@]}"; do
    base=$(basename "$dir")
    if [[ "$file" == "$base"* ]]; then
      absolute_files+="$(echo "$file" | sed "s|^$base|$dir|")"
      absolute_files+=$'\n'
    fi
  done
done

echo "$absolute_files" > "$OUTPUT_FILE"