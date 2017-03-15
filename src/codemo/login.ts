import * as vscode from 'vscode';
import * as firebase from 'firebase';

class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
	private _onDidChange = new vscode.EventEmitter < vscode.Uri > ();

	public provideTextDocumentContent(uri: vscode.Uri): string {
		return this.page()
	}

	get onDidChange(): vscode.Event < vscode.Uri > {
		return this._onDidChange.event;
	}

	public update(uri: vscode.Uri) {
		this._onDidChange.fire(uri);
	}

	private page(): string {
		return `<style>
				</style>
				<body>
					<script>
					<script>
					<form>
						<input type="text" placeholder="username"/>
						<input type="password" placeholder="username"/>
						<button type="button" id="login">Login</button>
					<form>
				</body>`;
	}
}

export default function login(): Promise < {} > {

	const promise = new Promise((resolve, reject) => {

		let provider = new TextDocumentContentProvider();
		let loginPageUri = vscode.Uri.parse('codemo-login://authority/codemo-login');
		vscode.workspace.registerTextDocumentContentProvider('codemo-login', provider);
		provider.update(loginPageUri);

		const command = vscode.commands.executeCommand('vscode.previewHtml', loginPageUri, vscode.ViewColumn.Two, 'Login to Codemo.')
		.then((success) => {
			provider.update(loginPageUri);
			resolve({})
		},
		(reason) => {
			reject({ message: reason })
		});
	})

	return promise;
}