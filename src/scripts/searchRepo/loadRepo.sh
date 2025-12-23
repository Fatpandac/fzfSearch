SCAN_PATHS=($(eval echo "$FZFSEARCH_REPO_PATH"))

load_repos() {
  gitRepos=$(fd -td --hidden --glob "*.git" "${SCAN_PATHS[@]}" 2>/dev/null | sed 's/\/\.git\/$//')
  workspace=$(fd -tf --hidden --glob "*.code-workspace" "${SCAN_PATHS[@]}" 2>/dev/null)

  echo "${gitRepos}\n${workspace}"
}