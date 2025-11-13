import * as vscode from 'vscode';
import * as os from 'os';
import path from 'path';
import * as fs from 'fs';
import { SEARCH_CONTENT_CMD, SEARCH_FILE_CMD } from './utils';

let terminal: vscode.Terminal | undefined;
let lastActiveEditor: vscode.Uri | undefined;

export function activate(context: vscode.ExtensionContext) {
	const disposableSearchFiles = vscode.commands.registerCommand('filesfzf.serach.file.toggle', () => {
		openTerminal(SEARCH_FILE_CMD);
	});
	const disposableSearchContent = vscode.commands.registerCommand('filesfzf.serach.content.toggle', () => {
		openTerminal(SEARCH_CONTENT_CMD);
	});

	context.subscriptions.push(disposableSearchFiles);
	context.subscriptions.push(disposableSearchContent);
}


async function openTerminal(cmd: (chooseFilePaths: string) => string) {
	try {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
			lastActiveEditor = activeEditor.document.uri;
		} else {
			lastActiveEditor = undefined;
		}
		let cwd = os.homedir();

		const chooseFilesPath = path.join(os.tmpdir(), './filesfzf.tmp');
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (workspaceFolder) {
			cwd = workspaceFolder.uri.fsPath;
		}
		terminal = vscode.window.createTerminal({
			name: "fzf",
			shellPath: "bash",
			shellArgs: ["-c", cmd(chooseFilesPath)],
			cwd: cwd,
			location: vscode.TerminalLocation.Editor,
		});

		terminal.show();
		const closeSubscription = vscode.window.onDidCloseTerminal((e) => {
			if (e === terminal) {
				if (fs.existsSync(chooseFilesPath)) {
					const selectedFiles = fs.readFileSync(chooseFilesPath, 'utf-8').trim().split('\n').filter(Boolean);
					if (selectedFiles.length === 0) {
						if (lastActiveEditor) {
							vscode.workspace.openTextDocument(lastActiveEditor)
								.then(doc => {
									vscode.window.showTextDocument(doc, { preview: false });
								})
								.then(undefined, () => {
								});
						}
						return;
					};

					selectedFiles.forEach(async (filePath) => {
						let paths = [filePath];
						if (filePath.includes(':')) {
							paths = filePath.split(":");
						}
						const fileUri = vscode.Uri.file(path.join(cwd, paths[0].trim()));
						try {
							const doc = await vscode.workspace.openTextDocument(fileUri);
							const editor = await vscode.window.showTextDocument(doc, { preview: false });
							if (paths.length > 1) {
								const position = new vscode.Position(Number(paths[1]) - 1, 0);
								const selection = new vscode.Selection(position, position);
								editor.selection = selection;
								editor.revealRange(
									new vscode.Range(position, position),
									vscode.TextEditorRevealType.InCenter
								);
							}
						} catch (openErr) {
							console.error(`Error opening file selected from FilesFzf:{openErr}`);
							vscode.window.showErrorMessage(`Failed to open: ${filePath}`);
						}
					});
				} else {
					console.log('No files selected or operation cancelled.');
				}
				closeSubscription.dispose();
			}
		});
	} catch {
		console.log('Open terminal fail');
	}
}

export function deactivate() { }
