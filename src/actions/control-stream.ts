'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as firebase from 'firebase';
import Codemo from '../codemo';

export default function (context) {
	const command = vscode.commands.registerCommand('extension.codemoControlStream', () => {

	});

	vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {

	});

	vscode.window.onDidChangeVisibleTextEditors((editors: vscode.TextEditor[]) => {

	});

	return command;
}