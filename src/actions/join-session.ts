'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Session from '../session';

export default function(context) {

    const command = vscode.commands.registerCommand('extension.codemoJoinSession', () => {
        vscode.window.showInputBox({prompt: 'Enter a Codemo Session ID'})
            .then(async streamId => {
                try {
                    await Session.join(streamId);
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
