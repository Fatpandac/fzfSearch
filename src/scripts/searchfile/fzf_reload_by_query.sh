#!/usr/bin/env zsh
fzf_reload_by_query() {
  q="$1"
  searchPaths=($(eval echo "$FZFSEARCH_SEARCH_PATHS"))
  typeset -A dir_map
  for dir in "${searchPaths[@]}"; do
    dir_map[${dir:t}]="$dir"
  done

  if [ -z "$q" ]; then
    print -rNC1 -- "${searchPaths[@]}" | xargs -0 -P 0 -I {} zsh -c '
      dir="{}"
      base="${dir:t}"
      dir="${dir%/}" 
      glob="$1"
      rg --hidden --glob "$RIPGREP_GLOB" --files "$dir" | sed "s|^$dir|$base|"
    ' _ "$RIPGREP_GLOB"
    return
  fi

  name=$(printf "%s" "$q:" | cut -d: -f1)
  line=$(printf "%s" "$q:" | cut -d: -f2)
  res=$(
    print -rNC1 -- "${searchPaths[@]}" | xargs -0 -P 0 -I {} zsh -c '
      dir="$1"
      glob="$2"
      name="$3"
      line="$4"

      base="${dir:t}"
      dir="${dir%/}"

      result=$(rg --hidden --glob "$glob" --files "$dir" | sed "s|^$dir|$base|" | fzf -f "$name")

      if [ -n "$result" ]; then
        if [ -n "$line" ]; then
          echo "${result}" | sed "s|$|:$line|"
        else
          echo "$result"
        fi
      fi
    ' _ {} "$RIPGREP_GLOB" "$name" "$line"
    return
  )
  echo "$res"
}