'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Session from '../session';

export default function(context) {

    const command = vscode.commands.registerCommand('extension.codemoStartStream', () => {
        vscode.window.showInputBox({prompt: 'Enter a name for your new Session.'})
            .then(async sessionName => {
                try {
                    await Session.start(sessionName);
                } catch(err) {
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
