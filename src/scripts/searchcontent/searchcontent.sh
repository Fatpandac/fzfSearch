#!/usr/bin/env zsh

OUTPUT_FILE="$1"
searchPaths=($(eval echo "$FZFSEARCH_SEARCH_PATHS"))

source "$(dirname "$0")/../config.sh"
previewPath="$(dirname "$0")/../preview.sh"

queryFileContent="$(dirname "$0")/query_file_content.sh"

selected=$(
fzf --phony --query "" \
  --preview "source $previewPath && preview {1} {2}" \
  --delimiter ':' \
  --preview-window "+{2}-10" \
  --bind "change:reload:(source $queryFileContent && query_file_content {q})" \
  --bind "start:reload:(source $queryFileContent && query_file_content {q})" \
  --bind "$KEYMAPPING" \
  --layout "$LAYOUT" \
  --multi
)

echo "$selected" | while read -r file; do
  for dir in "${searchPaths[@]}"; do
    base=$(basename "$dir")
    if [[ "$file" == "$base"* ]]; then
      (echo "$file" | sed "s|^$base|$dir|")
    fi
  done
done > "$OUTPUT_FILE"