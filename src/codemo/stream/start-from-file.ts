import * as vscode from 'vscode';
import * as firebase from 'firebase';

import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import StreamEdit from './lib/stream-edit-factory';
import StreamEventHandler from './lib/event-handlers';

const STREAMS_ROOT = `${vscode.workspace.rootPath}/.codemo-streams`;
const FirebaseFriendlyRefName = (streamName) => streamName.replace(/[^0-9a-zA-Z]/g, '');

function getEditor(fileName) {
	const editor = vscode.window.visibleTextEditors.filter(editor => {
		return editor.document.uri.path === fileName;
	});
	return editor.length && editor[0].document.uri;
}

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
		}).then((stream) => {

			vscode.window.showInformationMessage(`OK, your're streaming this file!`);
			const streamData = firebase.database().ref(`/streams/${stream.key}`);

			const eventHandlers = new StreamEventHandler({ document: streamFile, stream });


			// let localEdit;
			// const changeListenerFunction = (event) => {
			// 	if (event.document !== streamFile) return;

			// 	const edit = event.contentChanges[0];
			// 	localEdit = StreamEdit.save(edit);

			// 	if (localEdit.hash !== remoteEdit.hash) {
			// 		firebase.database().ref(`/streams/${stream.key}`)
			// 			.update({
			// 			text: streamFile.getText(),
			// 			lastEdit: localEdit
			// 		})
			// 	}
			// }

			let changeListener = vscode.workspace.onDidChangeTextDocument(eventHandlers.onEditorTextChange.bind(eventHandlers));
			streamData.on('value', eventHandlers.onStreamData);

			// let remoteEdit;
			// streamData.on('value', async function(stream) {
			// 	remoteEdit = stream.val().lastEdit || { hash: null };

			// 	const edit = new vscode.WorkspaceEdit();
			// 	const editor = getEditor(streamFile.fileName);

			// 	if(editor && remoteEdit.hash && remoteEdit.hash !== localEdit.hash) {
			// 		edit.set(editor, [StreamEdit.create(remoteEdit)])
			// 		await vscode.workspace.applyEdit(edit);
			// 	}
			// });
		})
	});
	return promise;
}
