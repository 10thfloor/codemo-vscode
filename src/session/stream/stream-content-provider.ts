import * as vscode from 'vscode';

export default class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {

    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private streamContent: string;

    public provideTextDocumentContent(uri: vscode.Uri): string {
        return this.streamContent;
    }

    public update(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
    }

    set steamContentText(text: string) {
        this.streamContent = text;
    }

    get onDidChange() {
        return this._onDidChange.event;
    }
}