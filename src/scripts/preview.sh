#!/usr/bin/env zsh
preview() {
    line="$2"
    searchPaths=($(eval echo "$FZFSEARCH_SEARCH_PATHS"))
    file=""
    for dir in "${searchPaths[@]}"; do
      base=$(basename "$dir")
      if [[ "$1" == "$base"* ]]; then
        file="$(echo "$1" | sed "s|^$base|$dir|")"
      fi
    done

    if [ -z "$line" ]; then
      bat --color=always --plain "$file" 2>/dev/null || true
    else
      bat --color=always --plain --highlight-line $line "$file" 2>/dev/null || true
    fi
}