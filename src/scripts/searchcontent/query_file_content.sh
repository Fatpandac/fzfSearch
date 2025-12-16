#!/usr/bin/env zsh
query_file_content() {
  q="$1"
  searchPaths=($(eval echo "$FZFSEARCH_SEARCH_PATHS"))

  if [ -z "$q" ]; then
    print -rNC1 -- "${searchPaths[@]}" | xargs -0 -P 0 -I {} zsh -c '
      dir="{}"
      base="${dir:t}"
      dir="${dir%/}" 
      glob="$1"
      rg -S --hidden --glob "$glob" -n "" "$dir" | sed "s|^$dir|$base|"
    ' _ "$RIPGREP_GLOB"
    return
  fi
  
  print -rNC1 -- "${searchPaths[@]}" | xargs -0 -P 0 -I {} zsh -c '
    q="$1"
    glob="$2"
    dir="$3"
    base="${dir:t}"
    dir="${dir%/}"
    rg -S --hidden --glob "$glob" -n "$q" "$dir" | sed "s|^$dir|$base|" ' _ "$q" "$RIPGREP_GLOB" {}
}