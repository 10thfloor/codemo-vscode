import * as vscode from 'vscode';
import * as firebase from 'firebase';

import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';

const STREAMS_ROOT = `${vscode.workspace.rootPath}/.codemo-streams`;

function buildNewStream(newStream, streamName) {
	return async function() {

		const streamFile = `${STREAMS_ROOT}/${streamName}.${newStream.mode}`;
		let fileExists: boolean = fs.existsSync(streamFile);

		if(!fileExists) {

			mkdirp.sync(STREAMS_ROOT);
			fs.writeFileSync(streamFile, newStream.text);

			const document = await vscode.workspace.openTextDocument(streamFile);

			vscode.window.showTextDocument(document, vscode.ViewColumn.Two)
			.then(() => {
				// const content = new vscode.WorkspaceEdit()
				// content.set(document.uri, [new vscode.TextEdit(new vscode.Range(0,0,0,0), newStream.text)]);
				// vscode.workspace.applyEdit(content);
			});

				vscode.workspace.onDidChangeTextDocument((event) => {

					const doc = event.document;
					if(path.basename(doc.fileName) === `${streamName}.${newStream.mode}`) {
						console.log(doc.fileName, doc.getText());
						firebase.database().ref(`/streams/${streamName}`).update({ text: doc.getText() });
					}
				});
		}
	}
}

export default function start(streamName): Promise<{}> {


	const promise = new Promise((resolve, reject) => {

			const newStream = {
				mode: 'js',
				text: '// Welcome to your new stream...\n',
				fileName: streamName
			}

			firebase.database().ref(`/streams/${streamName}`).set(newStream)
			.then(buildNewStream(newStream, streamName))
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
	});
	return promise;
}