import * as vscode from 'vscode';
import path from 'path';

import { openTerminal } from './baseCommand';
import { ensureToolsInstalled } from '../utils';

export function registerFilenameSearchCommand(context: vscode.ExtensionContext, commandID: string) {
  return vscode.commands.registerCommand('fzfsearch.search.file.toggle', () => {
    ensureToolsInstalled();

    const searchFileCmd = path.join(context.extensionPath, 'src', 'scripts', 'searchfile', 'searchfile.sh');
    openTerminal(searchFileCmd, "file");
  });
}