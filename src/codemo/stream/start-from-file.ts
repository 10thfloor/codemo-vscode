import * as vscode from 'vscode';
import * as firebase from 'firebase';

import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import StreamEdit from './lib/stream-edit-factory';

const STREAMS_ROOT = `${vscode.workspace.rootPath}/.codemo-streams`;
const FirebaseFriendlyRefName = (streamName) => streamName.replace(/[^0-9a-zA-Z]/g, '');

export default function startFromFile(context): Promise < {} > {
	const promise = new Promise((resolve, reject) => {
		if (!vscode.window.visibleTextEditors.length) {
			reject({
				message: 'A file has to be open to Stream. Open a file.'
			});
			return;
		}

		const streamFile = vscode.window.activeTextEditor.document;
		const streamName = path.basename(streamFile.fileName);

		return firebase.database().ref(`/streams`).push({
			text: streamFile.getText(),
			localStreamFileName: path.basename(streamFile.fileName),
			lastEdit: StreamEdit.init(streamFile)
		}).then((stream) => {

			vscode.window.showInformationMessage(`Your're streaming this file!`);

			vscode.workspace.onDidChangeTextDocument((event) => {
				if (event.document.fileName === streamFile.fileName) {
					const edit = event.contentChanges[0];
					firebase.database().ref(`/streams/${stream.name()}`)
						.update({
							text: streamFile.getText(),
							lastEdit: StreamEdit.save(edit)
						});
				}
			});
		})
	});
	return promise;
}