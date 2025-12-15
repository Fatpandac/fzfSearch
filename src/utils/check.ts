import * as vscode from 'vscode';
import { exec } from "child_process";

function checkCommandExists(cmd: string): Promise<boolean> {
  return new Promise((resolve) => {
    exec(`${cmd} --version`, (error) => {
      resolve(!error);
    });
  });
}

function generateDownloadCommand(tool: string): string {
  return `brew install ${tool}`;
}

export const NEEDED_CLI_TOOL = ["fzf", "rg", "bat"];

export async function ensureToolsInstalled(checkTools: string[] = NEEDED_CLI_TOOL) {
  for (const tool of checkTools) {
    const installed = await checkCommandExists(tool);
    if (!installed) {
      vscode.window
        .showWarningMessage(
          `"${tool}" is not installed. It is recommended to install it for full functionality.`,
          "Copy Install Command",
        )
        .then((selection) => {
          if (selection === "Copy Install Command") {
            vscode.env.clipboard.writeText(generateDownloadCommand(tool));
            vscode.window.showInformationMessage(
              `${tool} install command has been copied to the clipboard`,
            );
          }
        });
    }
  }
}
