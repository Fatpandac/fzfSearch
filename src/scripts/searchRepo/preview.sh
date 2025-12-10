#!/usr/bin/env zsh
gitSummery() {
  cd "$1" || return
  PROJECT=$(basename "$(git rev-parse --show-toplevel)")

  # HEAD 信息
  HEAD_COMMIT=$(git rev-parse --short HEAD)
  HEAD_BRANCH=$(git symbolic-ref --short HEAD)

  # 创建时间（最早一次提交）
  CREATED_AT=$(git log --reverse --format="%cs" | head -n 1)

  # 最近一次提交时间
  LAST_CHANGE=$(git log -1 --format="%cs")

  # 作者贡献
  AUTHORS=$(git shortlog -s -n | awk '{printf "%s %s commits\n", $2, $1}')

  # 文件/大小
  FILE_COUNT=$(git ls-files | wc -l | tr -d " ")
  SIZE=$(du -sh . | awk '{print $1}')

  # 行数
  LOC=$(git ls-files | xargs wc -l | tail -1 | awk '{print $1}')

  echo "Project: $PROJECT"
  echo "HEAD: $HEAD_COMMIT ($HEAD_BRANCH)"
  echo "Created: $CREATED_AT"
  echo "Last change: $LAST_CHANGE"
  echo "Files: $FILE_COUNT"
  echo "Size: $SIZE"
  echo "Lines of code: $LOC"
  echo "Dependencies: $DEP_COUNT (npm)"
  echo ""
  echo "Authors:"
  echo "$AUTHORS"
  echo "----------------------"
  bat --color=always --wrap=character --terminal-width $FZF_PREVIEW_COLUMNS --plain README.md 2>/dev/null || true
  cd - >/dev/null || return
}

preview() {
  repoPath="$1"

  if command -v onefetch >/dev/null 2>&1; then
    onefetch --no-art "$repoPath" 2>/dev/null || gitSummery "$repoPath"
  else 
    gitSummery "$repoPath"
  fi
}