import * as vscode from 'vscode';
import path from 'path';

import { openTerminal } from './baseCommand';
import { ensureToolsInstalled } from '../utils';

export function registerFileContentSearchCommand(context: vscode.ExtensionContext, commandID: string) {
  return vscode.commands.registerCommand(commandID, () => {
    ensureToolsInstalled();
    const searchContentCmd = path.join(context.extensionPath, 'src', 'scripts', 'searchcontent', 'searchcontent.sh');
    openTerminal(searchContentCmd, "file");
  });
}