import * as vscode from 'vscode';
import * as firebase from 'firebase';

import StreamContentProvider from './lib/stream-content-provider';
import StreamEdit from './lib/stream-edit-factory';

export default function join(streamName): Promise<{}> {

		const provider = new StreamContentProvider();

		const promise = new Promise((resolve, reject) => {
			const streamData = firebase.database().ref(`/streams/${streamName}`);


			streamData.once('value').then((stream) => {

				if(!stream.val()) {
					reject({ message: `Stream: ${streamName} is not a valid Codemo stream.` });
					return;
				}

				const streamContent = stream.val().text;
				const codemoStream = vscode.Uri.parse(`codemo-stream://authority/${streamName}/codemo-stream.js`);

				provider.steamContentText = streamContent;

				vscode.workspace.registerTextDocumentContentProvider('codemo-stream', provider);
				vscode.commands.executeCommand('vscode.open', codemoStream, vscode.ViewColumn.Two);
				provider.update(codemoStream);

				streamData.on('value', function(stream) {
					const lastEdit = stream.val().lastEdit;
					const edit = new vscode.WorkspaceEdit();
    				edit.set(codemoStream, [StreamEdit.create(lastEdit)]);
					vscode.workspace.applyEdit(edit);
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