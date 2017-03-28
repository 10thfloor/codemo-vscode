import * as vscode from 'vscode';
import * as firebase from 'firebase';

import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import StreamEdit from './lib/stream-edit-factory';
import StreamEventHandler from './lib/event-handlers';

const STREAMS_ROOT = `${vscode.workspace.rootPath}/.codemo-streams`;

function getEditor(streamEditor) {
	const editor = vscode.window.visibleTextEditors.filter(editor => {
		return editor.document.uri.path === streamEditor.fileName;
	});
	return editor.length && editor[0].document.uri;
}

const lineDecoration = vscode.window.createTextEditorDecorationType({
	backgroundColor: 'rgba(0,255,0,0.25)'
});

const lineDecorationOptions = function (line) {
	return [{
		range: line,
	}];
}

export default function join(streamId, streamFileName): Promise < {} > {

	const streamData = firebase.database().ref(`/streams/${streamId}`);

	const promise = new Promise((resolve, reject) => {

		streamData.once('value').then(async (stream) => {

			if (!stream.val()) {
				reject({
					message: `There was a problem joining this stream.`
				});
				return;
			}

			const streamFile = `${STREAMS_ROOT}/${streamFileName}`;

			mkdirp.sync(STREAMS_ROOT);
			fs.writeFileSync(streamFile, stream.val().text);

			const document = await vscode.workspace.openTextDocument(streamFile);
			vscode.window.showTextDocument(document, vscode.ViewColumn.Three);

			const eventHandlers = new StreamEventHandler({ document, stream });
			let changeListener = vscode.workspace.onDidChangeTextDocument(eventHandlers.onEditorTextChange);
			streamData.on('value', eventHandlers.onStreamData);


			resolve({});
		}).catch((err: any) => {
			switch (err.code) {
				case 'PERMISSION_DENIED':
					reject({
						message: 'You don\'t have access to this stream, please sign in to Codemo!'
					})
					break;
				default:
					reject({
						message: 'There was an error joining the stream, try again.'
					})
					console.log(err);
			}
		});
	});

	return promise;
}
