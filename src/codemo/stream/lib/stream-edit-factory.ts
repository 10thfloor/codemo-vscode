import * as vscode from 'vscode';

class StreamEditFactory {

	init(document) {
		const initEdit = new vscode.TextEdit(new vscode.Range(0, 0, 0, 0), document.getText());
		return this.save(initEdit);
	}

	save(edit) {
		return {
			text: edit.newText || edit.text,
			range: {
				start: {
					character: edit.range.start.character,
					line: edit.range.start.line
				},
				end: {
					character: edit.range.end.character,
					line: edit.range.end.line
				}
			}
		}
	}

	create(edit) {
		return new vscode.TextEdit(
			new vscode.Range(
				edit.range.start.line,
				edit.range.start.character,
				edit.range.end.line,
				edit.range.end.character
			),
			edit.text
		);
	}
}

const StreamEdit = new StreamEditFactory();

export default StreamEdit;