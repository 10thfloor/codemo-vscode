import * as vscode from 'vscode';
import * as firebase from 'firebase';

import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import StreamEdit from './lib/stream-edit-factory';

const STREAMS_ROOT = `${vscode.workspace.rootPath}/.codemo-streams`;

function getStreamEditor(document, cb) {
	const editor = vscode.window.visibleTextEditors.filter(editor => editor.document === document);
	cb(editor[0]);
}

function getStreamingEditorUri(streamEditor, fileName) {
	const editor = vscode.window.visibleTextEditors.filter(editor => {
		return editor.document.uri.path !== streamEditor.fileName;
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
			let fileExists: boolean = fs.existsSync(streamFile);


			if (!fileExists) {
				mkdirp.sync(STREAMS_ROOT);
				fs.writeFileSync(streamFile, stream.val().text);
			}

			const document = await vscode.workspace.openTextDocument(streamFile);
			const codemoStream = document;
			vscode.window.showTextDocument(document, vscode.ViewColumn.Three);


			let lastEdit;
			streamData.on('value', function (stream) {
				lastEdit = stream.val().lastEdit;
				const edit = new vscode.WorkspaceEdit();
				const editor = getStreamingEditorUri(codemoStream, stream);
				editor && edit.set(editor, [StreamEdit.create(lastEdit)])
					   && vscode.workspace.applyEdit(edit);
			});

			vscode.workspace.onDidChangeTextDocument((event) => {
				if (event.document === codemoStream) {
					// getStreamEditor(codemoStream, (editor: vscode.TextEditor) => {
					// 	if (!editor) return;
					// 	const line = event.document.lineAt(lastEdit.range.end.line).range;
					// 	editor.setDecorations(
					// 		lineDecoration,
					// 		lineDecorationOptions(line),
					// 	)
					// });
				} else {
					// getStreamEditor(codemoStream, (editor: vscode.TextEditor) => {
					// 	if (!editor) return;
					// 	const line = event.document.lineAt(lastEdit.range.end.line).range;
					// 	editor.setDecorations(
					// 		lineDecoration,
					// 		lineDecorationOptions(line),
					// 	)
					// });
					const edit = event.contentChanges[0];
					firebase.database().ref(`/streams/${stream.key}`)
						.update({
						text: codemoStream.getText(),
						lastEdit: StreamEdit.save(edit)
					});
				}
			});

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