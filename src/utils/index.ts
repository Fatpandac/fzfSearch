const KEYMAPPING = "ctrl-d:preview-half-page-down,ctrl-u:preview-half-page-up,esc:become:";

export const SEARCH_FILE_CMD = (chooseFilePaths: string) => {
	return `
fzf \
--preview "bat --color=always --plain {}" \
--bind "${KEYMAPPING}" --layout=reverse \
--multi > "${chooseFilePaths}"`;
};

export const SEARCH_CONTENT_CMD = (chooseFilePaths: string) => {
	return `
fzf --phony --query "" --layout=reverse \
--preview "bat --color=always --plain --highlight-line {2} {1}" \
--delimiter ':' \
--preview-window "+{2}-10" \
--bind "change:reload:(rg -n {q} || true)" \
--bind "${KEYMAPPING}" \
--multi > "${chooseFilePaths}"`;
};
