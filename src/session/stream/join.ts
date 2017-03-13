import * as vscode from 'vscode';
import * as firebase from 'firebase';

import StreamContentProvider from './lib/stream-content-provider';
import StreamEdit from './lib/stream-edit-factory';

function getStreamEditor(scheme, cb) {
	const editor = vscode.window.visibleTextEditors.filter(editor => editor.document.uri.scheme === scheme);
	cb(editor[0]);
}

const lineDecoration = vscode.window.createTextEditorDecorationType({
	backgroundColor: 'rgba(0,255,0,0.25)'
});

const lineDecorationOptions = function(line){
	return [{
		range: line,
	}];
}

export default function join(streamName): Promise<{}> {

	const provider = new StreamContentProvider();
	const codemoStream = vscode.Uri.parse(`codemo-stream://authority/${streamName}/codemo-stream.js`);
	const streamData = firebase.database().ref(`/streams/${streamName}`);

	const promise = new Promise((resolve, reject) => {

		streamData.once('value').then((stream) => {

			if(!stream.val()) {
				reject({ message: `Stream: ${streamName} is not a valid Codemo stream.` });
				return;
			}

			provider.steamContentText = stream.val().text;

			vscode.workspace.registerTextDocumentContentProvider('codemo-stream', provider);
			vscode.commands.executeCommand('vscode.open', codemoStream, vscode.ViewColumn.Two);
			provider.update(codemoStream);

			let lastEdit;
			streamData.on('value', function(stream) {
				lastEdit = stream.val().lastEdit;
				const edit = new vscode.WorkspaceEdit();
				edit.set(codemoStream, [StreamEdit.create(lastEdit)]);
				vscode.workspace.applyEdit(edit);
			});

			vscode.workspace.onDidChangeTextDocument((event) => {
				const scheme = codemoStream.scheme;
				if(event.document.uri.scheme === scheme) {
					getStreamEditor(scheme, (editor: vscode.TextEditor) => {
						if(!editor) return;
						const line = event.document.lineAt(lastEdit.range.end).range;
						editor.setDecorations(
							lineDecoration,
							lineDecorationOptions(line),
						)
					});
				};
			});

			resolve({});
		}).catch((err: any) => {
			switch(err.code) {
				case 'PERMISSION_DENIED':
				reject({ message: 'You don\'t have access to this stream, please sign in to Codemo!'})
				break;
				default:
				reject({ message: 'There was an error joining the stream, try again.'})
			}
		});
	});

	return promise;
}