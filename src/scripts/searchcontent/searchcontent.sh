#!/usr/bin/env zsh

OUTPUT_FILE="$1"

source "$(dirname "$0")/../config.sh"

fzf --phony --query "" \
  --preview "bat --color=always --plain --highlight-line {2} {1} 2>/dev/null || true" \
  --delimiter ':' \
  --preview-window "+{2}-10" \
  --bind "change:reload:(rg --hidden --glob $RIPGREP_GLOB -n {q} || true)" \
  --bind "start:reload:(rg --hidden --glob $RIPGREP_GLOB -n {q} || true)" \
  --bind "$KEYMAPPING" \
  --layout "$LAYOUT" \
  --multi > "${OUTPUT_FILE}";