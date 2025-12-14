#!/usr/bin/env zsh
preview() {
    line="$2"
    file="$(echo "$1" | sed "s|^~/|$HOME/|")"

    if [ -z "$line" ]; then
      bat --color=always --plain "$file" 2>/dev/null || true
    else
      bat --color=always --plain --highlight-line $line "$file" 2>/dev/null || true
    fi
}