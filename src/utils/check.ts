import * as vscode from 'vscode';
import { exec } from "child_process";

const NEEDED_CLI_TOOL = ["fzf", "rg", "bat"];

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

export async function ensureToolsInstalled() {
  for (const tool of NEEDED_CLI_TOOL) {
    const installed = await checkCommandExists(tool);
    if (!installed) {
      vscode.window
        .showWarningMessage(
          `未检测到 "${tool}"，建议安装以获得完整功能`,
          "复制安装命令",
        )
        .then((selection) => {
          if (selection === "复制安装命令") {
            vscode.env.clipboard.writeText(generateDownloadCommand(tool));
            vscode.window.showInformationMessage(
              `${tool} 安装命令已复制到剪贴板`,
            );
          }
        });
    }
  }
}
