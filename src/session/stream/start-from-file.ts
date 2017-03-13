import * as vscode from 'vscode';
import * as firebase from 'firebase';

import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import start from './start'

const STREAMS_ROOT = `${vscode.workspace.rootPath}/.codemo-streams`;

export default function startFromFile(context): Promise<{}> {
	const promise = new Promise((resolve, reject) => {
		if(!vscode.window.visibleTextEditors.length) {
			reject({ message: 'A file has to be open to Stream. Open a file.'});
			return;
		}

		const streamFile = vscode.window.activeTextEditor.document;

		start(
			path.basename(streamFile.fileName),
			streamFile.getText(),
			false
			)
		.then(() => {
			resolve({})
		}).catch((err) => {
			reject({ message: err });
		})
	});
	return promise;
}