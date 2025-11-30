#!/usr/bin/env zsh

fzf_reload_by_query() {
  q="$1"

  if [ -z "$q" ]; then
    rg --files
    return
  fi

  name=$(printf "%s" "$q:" | cut -d: -f1)
  line=$(printf "%s" "$q:" | cut -d: -f2)
  res=$(rg --files | rg -i "$name")

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
    max_line=$(wc -l < "$file" | tr -d " ")
    if [ "$line" -gt "$max_line" ]; then
      echo "$file:$max_line"
    else
      echo "$file:$line"
    fi
  done
}