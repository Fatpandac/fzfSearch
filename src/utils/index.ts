import * as vscode from 'vscode';

export function getExcludeGlob(): string {
	const config = vscode.workspace.getConfiguration('fzfsearch');
	return config.get<string>('excludeGlob', '');
}

export function getRepositoryPath(): string[] {
	const config = vscode.workspace.getConfiguration('fzfsearch');
	return config.get<string[]>('repositoryPath', []);
}

export enum OpenRepoOption {
	CurrentWindow = 0,
	NewWindow = 1,
	CurrentWorkspace = 2,
}

export function openFolder(uri: vscode.Uri, option: OpenRepoOption) {
	if ([OpenRepoOption.CurrentWindow, OpenRepoOption.NewWindow].includes(option)) {
		const openInNewWindow = option === OpenRepoOption.NewWindow;
		vscode.commands.executeCommand('vscode.openFolder', uri, openInNewWindow);
	} else if (option === OpenRepoOption.CurrentWorkspace) {
		if (vscode.workspace.updateWorkspaceFolders) {
			vscode.workspace.updateWorkspaceFolders(
				vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0,
				null,
				{ uri: uri }
			);
		} else {
			vscode.window.showErrorMessage('Adding folder to workspace is not supported in this version of VS Code.');
		}
	}
}

export * from './check';