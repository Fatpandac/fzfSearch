import * as vscode from 'vscode';

import {
	registerFilenameSearchCommand,
	registerRepositorySearchCommand,
	registerFileContentSearchCommand,
} from './commands';

export function activate(context: vscode.ExtensionContext) {
	const disposableSearchFiles = registerFilenameSearchCommand(context, 'fzfsearch.search.file.toggle');
	const disposableSearchRepo = registerRepositorySearchCommand(context, 'fzfsearch.search.repo.toggle');
	const disposableSearchContent = registerFileContentSearchCommand(context, 'fzfsearch.search.content.toggle');

	context.subscriptions.push(disposableSearchRepo);
	context.subscriptions.push(disposableSearchFiles);
	context.subscriptions.push(disposableSearchContent);
}

export function deactivate() {
	// Nothing to clean up yet
 }
