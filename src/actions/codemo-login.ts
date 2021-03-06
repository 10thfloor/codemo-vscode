'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as firebase from 'firebase';
import Codemo from '../codemo';

export default function (context) {
	const command = vscode.commands.registerCommand('extension.codemoLogin', async() => {
		try {
			await Codemo.login();
		} catch (err) {
			vscode.window.showErrorMessage(err.message);
		}
	});

	return command;
}