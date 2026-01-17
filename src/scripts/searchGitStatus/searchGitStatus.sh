#!/usr/bin/env zsh

OUTPUT_FILE="$1"

searchPaths=($(eval echo "$FZFSEARCH_SEARCH_PATHS"))
cd "${searchPaths[0]}"

source "$(dirname "$0")/../config.sh"
previewPath="$(dirname "$0")/preview.sh"

git -c color.status=always status -s | fzf --ansi \
  --preview="source $previewPath && preview {2}" \
  --bind='ctrl-a:+execute-silent(
    if git diff --cached --name-only | grep -Fxq {2}; then
      git restore --staged {2}
    else
      git add {2}
    fi
  )+reload(git -c color.status=always status -s)' \
  --bind="enter:+execute-silent(echo $(pwd)/{2} > "$OUTPUT_FILE")+abort" \
  --layout "$LAYOUT" || true
