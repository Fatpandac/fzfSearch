import * as vscode from 'vscode';
import * as os from 'os';
import path from 'path';
import * as fs from 'fs';
import { ensureToolsInstalled } from './utils';

let terminal: vscode.Terminal | undefined;
let lastActiveEditor: vscode.Uri | undefined;


function getExcludeGlob(): string {
	const config = vscode.workspace.getConfiguration('fzfsearch');
	return config.get<string>('excludeGlob', '');
}

export function activate(context: vscode.ExtensionContext) {
	ensureToolsInstalled();
	const disposableSearchFiles = vscode.commands.registerCommand('fzfsearch.search.file.toggle', () => {
		const searchFileCmd = path.join(context.extensionPath, 'src', 'scripts', 'searchfile', 'searchfile.sh');
		openTerminal(searchFileCmd);
	});
	const disposableSearchContent = vscode.commands.registerCommand('fzfsearch.search.content.toggle', () => {
		const searchContentCmd = path.join(context.extensionPath, 'src', 'scripts', 'searchcontent', 'searchcontent.sh');
		openTerminal(searchContentCmd);
	});

	context.subscriptions.push(disposableSearchFiles);
	context.subscriptions.push(disposableSearchContent);
}


async function openTerminal(scriptPath: string) {
	try {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
			lastActiveEditor = activeEditor.document.uri;
		} else {
			lastActiveEditor = undefined;
		}
		let cwd = os.homedir();

		const chooseFilesPath = path.join(os.tmpdir(), './fzfsearch.tmp');
		const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
		if (workspaceFolder) {
			cwd = workspaceFolder.uri.fsPath;
		}
		terminal = vscode.window.createTerminal({
			name: "fzf",
			shellPath: "bash",
			shellArgs: ["-c", `${scriptPath} ${chooseFilesPath}`],
			cwd: cwd,
			env: {
				'RIPGREP_GLOB': getExcludeGlob(),
			},
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
