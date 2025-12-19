#!/usr/bin/env zsh
ONEFETCH_PATH="$(command -v onefetch || true)"
GIT_PATH="$(command -v git || true)"

gitSummery() {
  cd "$1" || return
  PROJECT=$(basename "$(git rev-parse --show-toplevel)")

  # HEAD 信息
  HEAD_COMMIT=$($GIT_PATH rev-parse --short HEAD)
  HEAD_BRANCH=$($GIT_PATH symbolic-ref --short HEAD)

  # 创建时间（最早一次提交）
  CREATED_AT=$($GIT_PATH log --reverse --format="%cs" | head -n 1)
  # 最近一次提交时间
  LAST_CHANGE=$($GIT_PATH log -1 --format="%cs")

  # 作者贡献
  AUTHORS=$($GIT_PATH shortlog -s -n | awk '{printf "%s %s commits\n", $2, $1}')
  # 文件/大小
  FILE_COUNT=$($GIT_PATH ls-files | wc -l | tr -d " ")
  SIZE=$(du -sh . | awk '{print $1}')

  # 行数
  LOC=$($GIT_PATH ls-files | xargs wc -l | tail -1 | awk '{print $1}')
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

  if [[ "$repoPath" == *.code-workspace ]]; then
    repos=("${(@f)$(jq -r '.folders[].path' "$repoPath")}")
    echo "Folder: "
    for repo in $repos; do
      echo "$repo"
    done
    echo "----------------------"
    root="$(dirname "$repoPath")"
    for repo in $repos; do
      path="$root/$repo"
      $ONEFETCH_PATH --no-art --no-title --no-color-palette "$path" 2>/dev/null || gitSummery "$path"
      echo ""
    done
    return
  fi

  $ONEFETCH_PATH --no-art --no-title --no-color-palette "$repoPath" 2>/dev/null || gitSummery "$repoPath"
}