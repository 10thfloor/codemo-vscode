'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Codemo from '../codemo';

export default function (context) {

	const command = vscode.commands.registerCommand('extension.codemoStartStream', () => {
		vscode.window.showInputBox({
				prompt: 'Enter a name for your new Stream.'
			})
			.then(async streamName => {
				try {
					await Codemo.start(streamName);
				} catch (err) {
					vscode.window.showErrorMessage(err.message);
				}
			});
	});

	vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {

	});

	vscode.window.onDidChangeVisibleTextEditors((editors: vscode.TextEditor[]) => {

	});

	return command;
}