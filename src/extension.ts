'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as firebase from 'firebase';

import joinSession from './actions/join-session';
import startSession from './actions/start-session';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

     // Initialize Firebase
    const config = {
        apiKey: "AIzaSyCnJQepRSQ9A1yAannhT76ugtUGGyrEU2s",
        authDomain: "codemo-21829.firebaseapp.com",
        databaseURL: "https://codemo-21829.firebaseio.com",
        storageBucket: "codemo-21829.appspot.com",
        messagingSenderId: "1095893987589"
    };

    firebase.initializeApp(config);
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Codemo extension is active!');

    context.subscriptions.push(joinSession(context));
    context.subscriptions.push(startSession(context));

}

// this method is called when your extension is deactivated
export function deactivate() {
  
}