#!/usr/bin/env zsh
preview() {
    line="$2"
    file="$1"
    
    if [ -z "$2" ]; then
      bat --color=always --plain $1 2>/dev/null || true
    else
      bat --color=always --plain --highlight-line $2 $1 2>/dev/null || true
    fi
}