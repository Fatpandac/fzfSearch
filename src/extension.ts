import * as vscode from 'vscode';
import * as os from 'os';
import path from 'path';
import * as fs from 'fs';
import { ensureToolsInstalled, REPO_SEARCH_NEEDED_CLI_TOOL } from './utils';
import { url } from 'inspector';

let terminal: vscode.Terminal | undefined;
let lastActiveEditor: vscode.Uri | undefined;


function getExcludeGlob(): string {
	const config = vscode.workspace.getConfiguration('fzfsearch');
	return config.get<string>('excludeGlob', '');
}

function getRepositoryPath(): string[] {
	const config = vscode.workspace.getConfiguration('fzfsearch');
	return config.get<string[]>('repositoryPath', []);
}

export function activate(context: vscode.ExtensionContext) {
	const disposableSearchFiles = vscode.commands.registerCommand('fzfsearch.search.file.toggle', () => {
		ensureToolsInstalled();
		const searchFileCmd = path.join(context.extensionPath, 'src', 'scripts', 'searchfile', 'searchfile.sh');
		openTerminal(searchFileCmd, "file");
	});
	const disposableSearchContent = vscode.commands.registerCommand('fzfsearch.search.content.toggle', () => {
		ensureToolsInstalled();
		const searchContentCmd = path.join(context.extensionPath, 'src', 'scripts', 'searchcontent', 'searchcontent.sh');
		openTerminal(searchContentCmd, "file");
	});
	const disposableSearchRepo = vscode.commands.registerCommand('fzfsearch.search.repo.toggle', () => {
		ensureToolsInstalled(REPO_SEARCH_NEEDED_CLI_TOOL);
		const searchRepoCmd = path.join(context.extensionPath, 'src', 'scripts', 'searchRepo', 'searchRepo.sh');
		openTerminal(searchRepoCmd, "repo");
	});

	context.subscriptions.push(disposableSearchFiles);
	context.subscriptions.push(disposableSearchContent);
	context.subscriptions.push(disposableSearchRepo);
}


async function openTerminal(scriptPath: string, type: "file" | "repo") {
	try {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
			lastActiveEditor = activeEditor.document.uri;
		} else {
			lastActiveEditor = undefined;
		}
		let searchPaths = [os.homedir()];

		const chooseFilesPath = path.join(os.tmpdir(), './fzfsearch.tmp');
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (workspaceFolders && workspaceFolders.length >= 1) {
			searchPaths = workspaceFolders.map(folder => folder.uri.fsPath);
		}
		terminal = vscode.window.createTerminal({
			name: "fzf",
			shellPath: "bash",
			shellArgs: ["-c", `${scriptPath} ${chooseFilesPath}`],
			env: {
				'FZFSEARCH_SEARCH_PATHS': searchPaths.join(' '),
				'RIPGREP_GLOB': type === "file" ? getExcludeGlob() : null,
				'FZFSEARCH_REPO_PATH': type === "repo" ? getRepositoryPath().join(' ') : null,
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

					if (type === "file") {
						selectedFiles.forEach(async (filePath) => {
							let paths = [filePath];
							if (filePath.includes(':')) {
								paths = filePath.split(":");
							}
							const fileUri = vscode.Uri.file(paths[0].trim());
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
					} else if (type === "repo") {
						const repoPath = selectedFiles[0];
						const [uri, openOption] = repoPath.includes(':') ? selectedFiles[0].split(':') : [repoPath, '0'];
						const OPEN_REPO_IS_CURRENT_WORKSPACE = vscode.workspace.workspaceFolders &&
							vscode.workspace.workspaceFolders.length > 0 &&
							vscode.workspace.workspaceFolders[0].uri.fsPath === uri;
						if (OPEN_REPO_IS_CURRENT_WORKSPACE) { return; }

						const repoUri = vscode.Uri.file(uri.trim());
						const openWindowOption = openOption.trim() === '1' ? true : false;
						vscode.commands.executeCommand('vscode.openFolder', repoUri, openWindowOption);
					}
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
