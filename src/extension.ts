'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as firebase from 'firebase';

import codemoLogin from './actions/codemo-login';
import joinStream from './actions/join-stream';
import startStream from './actions/start-stream';
import startFileStream from './actions/start-file-stream';
import controlStream from './actions/control-stream';
import takeoverStream from './actions/takeover-stream';


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

	context.subscriptions.push(codemoLogin(context));
	context.subscriptions.push(joinStream(context));
	// context.subscriptions.push(startStream(context));
	context.subscriptions.push(startFileStream(context))
	context.subscriptions.push(controlStream(context));
	context.subscriptions.push(takeoverStream(context));

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Codemo extension is active!');

}

// this method is called when your extension is deactivated
export function deactivate() {

}