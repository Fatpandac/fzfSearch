#!/usr/bin/env zsh
query_files() {
  searchPaths=($(eval echo "$FZFSEARCH_SEARCH_PATHS"))
    
  # xargs to handle multiple paths and remove the $HOME
  echo -e "${searchPaths[*]// /\\n}" | xargs -I {} rg --hidden --glob $RIPGREP_GLOB --files "{}" | sed "s|^$HOME/|~/|"
}