#!/usr/bin/env zsh
fzf_reload_by_query() {
  q="$1"
  searchPaths=($(eval echo "$FZFSEARCH_SEARCH_PATHS"))

  if [ -z "$q" ]; then
    for dir in "${searchPaths[@]}"; do
     base=$(basename "$dir")
     (rg --hidden --glob "$RIPGREP_GLOB" --files "$dir" | sed "s|^$dir|$base|")
    done
    return
  fi

  name=$(printf "%s" "$q:" | cut -d: -f1)
  line=$(printf "%s" "$q:" | cut -d: -f2)
  res=$(
    for dir in "${searchPaths[@]}"; do
     base=$(basename "$dir")
     rg --hidden --glob "$RIPGREP_GLOB" --files "$dir" | sed "s|^$dir|$base|" | fzf -f "$name"
    done
  )

  if [ -z "$res" ]; then
    return
  fi

  if [ -z "$line" ]; then
    if [[ "$q" == *:* ]]; then
      echo "$res" | xargs -I{} echo {}:
    else
      echo "$res"
    fi
    return
  fi

  echo "$res" | while read -r file; do
    for dir in "${searchPaths[@]}"; do
      base=$(basename "$dir")
      if [[ "$file" == "$base"* ]]; then
        absolute_file="$(echo "$file" | sed "s|^$base|$dir|")"
        max_line=$(wc -l < "$absolute_file" | tr -d " ")
        if [ "$line" -gt "$max_line" ]; then
          echo "$file:$max_line"
        else
          echo "$file:$line"
        fi
      fi
    done
  done
}