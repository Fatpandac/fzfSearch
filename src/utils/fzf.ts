const KEYMAPPING = "--bind \"ctrl-d:preview-half-page-down,ctrl-u:preview-half-page-up,esc:become:\"";
const LAYOUT = "--layout=reverse";
const CYCLE = "--cycle";

export const SEARCH_FILE_CMD = (chooseFilePaths: string) => {
	return `
fzf \
--preview "bat --color=always --plain {}" \
${LAYOUT} \
${KEYMAPPING} \
${CYCLE} \
--multi > "${chooseFilePaths}"`;
};

export const SEARCH_CONTENT_CMD = (chooseFilePaths: string) => {
	return `
fzf --phony --query "" ${LAYOUT} \
--preview "bat --color=always --plain --highlight-line {2} {1} 2>/dev/null || true" \
--delimiter ':' \
--preview-window "+{2}-10" \
--bind "change:reload:(rg -n {q} || true)" \
${KEYMAPPING} \
${CYCLE} \
--multi > "${chooseFilePaths}"`;
};
