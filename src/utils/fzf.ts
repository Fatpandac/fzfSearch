const KEYMAPPING = "--bind \"ctrl-d:preview-half-page-down,ctrl-u:preview-half-page-up,esc:become:\"";
const LAYOUT = "--layout=reverse";
const CYCLE = "--cycle";

export const SEARCH_FILE_CMD = (chooseFilePaths: string) => {
	return `
fzf --phony --query "" \
--delimiter ':' \
--preview-window "+{2}-10" \
--preview "
  if [ -z "{2}" ]; then
    bat --color=always --plain {1} 2>/dev/null || true
  else
    bat --color=always --plain --highlight-line {2} {1} 2>/dev/null || true
  fi
" \
--bind 'change:reload:(
  q={q};
  if [ -z "$q" ]; then
    rg --files
  fi
  name=$(printf "%s" $q: | cut -d: -f1);
  line=$(printf "%s" $q: | cut -d: -f2);
  res=$(rg --files | rg -i $name);

  if [ -z "$res" ]; then
	return
  fi

  if [ -z "$line" ]; then
  	if [[ $q == *:* ]]; then
    	echo $res | xargs -I{} echo {}:
	else
		echo $res
	fi
  else
    echo "$res" | while read -r file; do
      max_line=$(wc -l < $file | tr -d " ");
      if [ "$line" -gt "$max_line" ]; then
        echo "$file:$max_line"
      else
        echo "$file:$line"
      fi
    done
  fi
)' \
--bind "start:reload:(rg --files)" \
${LAYOUT} \
${KEYMAPPING} \
${CYCLE} \
--multi > "${chooseFilePaths}"`;
};

export const SEARCH_CONTENT_CMD = (chooseFilePaths: string) => {
	return `
fzf --phony --query "" \
--preview "bat --color=always --plain --highlight-line {2} {1} 2>/dev/null || true" \
--delimiter ':' \
--preview-window "+{2}-10" \
--bind "change:reload:(rg -n {q} || true)" \
--bind "start:reload:(rg -n {q} || true)" \
${LAYOUT} \
${KEYMAPPING} \
${CYCLE} \
--multi > "${chooseFilePaths}"`;
};
