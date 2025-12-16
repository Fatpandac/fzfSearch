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
      dir="{}"
      base="${dir:t}"
      dir="${dir%/}" 
      glob="$1"
      name="$2"
      rg --hidden --glob "$RIPGREP_GLOB" --files "$dir" | sed "s|^$dir|$base|" | fzf -f "$name"
    ' _ "$RIPGREP_GLOB" "$name"
    return

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

  while IFS= read -r file; do
    for base abs_dir in "${(@kv)dir_map}"; do
      if [[ "$file" == "$base"* ]]; then
        abs_file="${file/$base/$abs_dir}"
        
        if [[ -f "$abs_file" ]]; then
            echo "$file:$line"
        else
          echo "$file:$line"
        fi
        break
      fi
    done
  done <<< "$res"
}