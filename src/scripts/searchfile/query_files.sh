#!/usr/bin/env zsh
query_files() {
  searchPaths=($(eval echo "$FZFSEARCH_SEARCH_PATHS"))
    
  for dir in "${searchPaths[@]}"; do
   base=$(basename "$dir")
   (rg --hidden --glob "$RIPGREP_GLOB" --files "$dir" | sed "s|^$dir|$base|")
  done
}