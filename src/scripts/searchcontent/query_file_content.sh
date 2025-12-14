#!/usr/bin/env zsh
query_file_content() {
  q="$1"
  searchPaths=($(eval echo "$FZFSEARCH_SEARCH_PATHS"))

  if [ -z "$q" ]; then
    echo -e "${searchPaths[*]// /\\n}" | xargs -I {} rg --hidden --glob $RIPGREP_GLOB -n "" "{}" | sed "s|^$HOME/|~/|"
    return
  fi
  
  echo -e "${searchPaths[*]// /\\n}" | xargs -I {} rg --hidden --glob $RIPGREP_GLOB -n "$q" "{}" | sed "s|^$HOME/|~/|"
}