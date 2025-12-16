format_to_short_path() {
  local dir base line
  while IFS= read -r line; do
    echo "$line" >> a.txt
    for dir in "${searchPaths[@]}"; do
      dir="${dir%/}"
      if [[ "$line" == "$dir"/* ]]; then
        base=$(basename "$dir")
        echo "${line/$dir\//$base/}"
        continue 2
      fi
    done
    echo "$line"
  done
}