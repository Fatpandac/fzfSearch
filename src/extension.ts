import * as vscode from 'vscode';

import {
	registerFilenameSearchCommand,
	registerGitStatusSearchCommand,
	registerRepositorySearchCommand,
	registerFileContentSearchCommand,
} from './commands';

export function activate(context: vscode.ExtensionContext) {
	const disposableSearchFiles = registerFilenameSearchCommand(context, 'fzfsearch.search.file.toggle');
	const disposableSearchRepo = registerRepositorySearchCommand(context, 'fzfsearch.search.repo.toggle');
	const disposableSearchContent = registerFileContentSearchCommand(context, 'fzfsearch.search.content.toggle');
	const disposableSearchGitStatus = registerGitStatusSearchCommand(context, 'fzfsearch.search.gitStatus.toggle');

	context.subscriptions.push(disposableSearchRepo);
	context.subscriptions.push(disposableSearchFiles);
	context.subscriptions.push(disposableSearchContent);
	context.subscriptions.push(disposableSearchGitStatus);
}

export function deactivate() {
	// Nothing to clean up yet
 }
