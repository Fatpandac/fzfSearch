#!/usr/bin/env zsh

preview() {
  filePath="$1"

  if git diff --cached --name-only | grep -Fxq "$filePath"; then
    git diff --cached --color=always "$filePath"
  else
    git diff --color=always "$filePath"
  fi
}