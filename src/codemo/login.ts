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
					body, html {
						display:flex;
						flex-direction: column;
						width: 100%;
						height: 100%;
						background: #222;
						align-items: center;
						justify-content: center;
					}
				</style>
				<body>
					Hello?
					<form>
						<input type="text" placeholder="username"/>
						<input type="password" placeholder="password"/>
						<button type="button" id="login">Login</button>
					<form>
					<script src="https://www.gstatic.com/firebasejs/3.7.1/firebase.js"></script>
					<a class="jsbin-embed" href="https://jsbin.com/ciwenojode/1/embed?output"></a><script src="https://static.jsbin.com/js/embed.min.js?3.41.6"></script>
					<script>
					const config = {
						apiKey: "AIzaSyCnJQepRSQ9A1yAannhT76ugtUGGyrEU2s",
						authDomain: "codemo-21829.firebaseapp.com",
						databaseURL: "https://codemo-21829.firebaseio.com",
						storageBucket: "codemo-21829.appspot.com",
						messagingSenderId: "1095893987589"
					};
					firebase.initializeApp(config);
					var button = document.getElementById('login');
						button.addEventListener('click', function() {
							console.log(firebase);
						});
					</script>
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