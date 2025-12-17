import * as vscode from 'vscode';
import path from 'path';

import { openTerminal } from './baseCommand';
import { ensureToolsInstalled } from '../utils';

const GIT_STATUS_SEARCH_NEEDED_CLI_TOOL = ["fzf", "git"];

export function registerGitStatusSearchCommand(context: vscode.ExtensionContext, commandID: string) {
  return vscode.commands.registerCommand(commandID, () => {
    ensureToolsInstalled(GIT_STATUS_SEARCH_NEEDED_CLI_TOOL);

    const searchRepoCmd = path.join(context.extensionPath, 'src', 'scripts', 'searchGitStatus', 'searchGitStatus.sh');
    openTerminal(searchRepoCmd, "file");
  });
}