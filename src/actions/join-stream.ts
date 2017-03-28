'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as firebase from 'firebase';
import Codemo from '../codemo';

export default function (context) {
	const command = vscode.commands.registerCommand('extension.codemoJoinStream', () => {

		const streamData = firebase.database().ref('/streams');
		streamData.once('value', (streams) => {
			if (streams.hasChildren()) {
				const streamsList: vscode.QuickPickItem[] = [];
				streams.forEach(stream => {
					streamsList.push({
						label: `Stream: `,
						detail: `${stream.val().localStreamFileName}`,
						description: `${stream.key}`
					});
					return false;
				});
				vscode.window.showQuickPick(streamsList)
					.then(async stream => {
						if (!stream) return;
						try {
							await Codemo.clone(stream.description, stream.detail);
						} catch (err) {
							vscode.window.showErrorMessage(err.message);
						}
					});
			}
		});
	});

	vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {

	});

	vscode.window.onDidChangeVisibleTextEditors((editors: vscode.TextEditor[]) => {

	});

	return command;
}