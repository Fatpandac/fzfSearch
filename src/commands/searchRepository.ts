import * as vscode from 'vscode';
import path from 'path';

import { openTerminal } from './baseCommand';
import { ensureToolsInstalled } from '../utils';

const REPO_SEARCH_NEEDED_CLI_TOOL = ["fzf", "bat", "fd"];

export function registerRepositorySearchCommand(context: vscode.ExtensionContext, commandID: string) {
  return vscode.commands.registerCommand(commandID, () => {
    ensureToolsInstalled(REPO_SEARCH_NEEDED_CLI_TOOL);
    
    const searchRepoCmd = path.join(context.extensionPath, 'src', 'scripts', 'searchRepo', 'searchRepo.sh');
    openTerminal(searchRepoCmd, "repo");
  });
}