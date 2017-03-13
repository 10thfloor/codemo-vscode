import * as vscode from 'vscode';
import * as firebase from 'firebase';

import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

import StreamEdit from './lib/stream-edit-factory';

const STREAMS_ROOT = `${vscode.workspace.rootPath}/.codemo-streams`;

export default function start(streamName, streamContent?, streamMode?): Promise<{}> {


	const promise = new Promise((resolve, reject) => {

		buildNewStream(streamName, streamContent, streamMode)()
		.then(() => {
			resolve({});
		})
		.catch((err: any ) => {
			switch(err.code) {
				case 'PERMISSION_DENIED':
				reject({ message: `A stream with the name: ${streamName} exists.`})
				break;
				default:
				console.log(err);
				reject({ message: 'There was an error joining the stream, try again.'})
			}
		});
	})
	return promise;
}

function buildNewStream(
	streamName,
	streamContent = '// Welcome to your new stream...\n',
	streamMode = '.js'
	) {
	let document;
	const STREAM_PREFIX = 'stream-'
	return async function() {

		const streamFile = `${STREAMS_ROOT}/${STREAM_PREFIX}${streamName}${streamMode ? streamMode : ''}`;
		let fileExists: boolean = fs.existsSync(streamFile);

		if(!fileExists) {
			mkdirp.sync(STREAMS_ROOT);
			fs.writeFileSync(streamFile, streamContent);

			document = await vscode.workspace.openTextDocument(streamFile);
			vscode.window.showTextDocument(document, vscode.ViewColumn.Two)

			const FirebaseFriendlyRefName = streamName.replace(/[^0-9a-zA-Z]/g, '');

			vscode.workspace.onDidChangeTextDocument((event) => {
				if(event.document.fileName === document.fileName) {
					const edit = event.contentChanges[0];
					firebase.database().ref(`/streams/${FirebaseFriendlyRefName}`)
							.update({
								text: document.getText() ,
								lastEdit: StreamEdit.save(edit)
							});

				}
			});

			return firebase.database().ref(`/streams/${FirebaseFriendlyRefName}`).set({
				text: document.getText(),
				localStreamFileName: path.basename(document.fileName),
				lastEdit: StreamEdit.init(document);
			});
		}
	}
}