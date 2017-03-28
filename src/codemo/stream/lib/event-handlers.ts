import * as vscode from 'vscode';

import StreamEdit from '../lib/stream-edit-factory';

interface Edit {
  text: string;
  range: Object;
  user: string;
  hash: string;
}

interface FirebaseStream {
  key: string;
}

class StreamEventHandler {

  localEdit: Edit;
  remoteEdit: Edit;
  stream: FirebaseStream;
  codemoStream: vscode.TextDocument;

  constructor({document, stream}) {
    this.codemoStream = document;
    this.stream = stream;
    this.onStreamData = this.onStreamData.bind(this);
  }

  getEditor() {
    const editor = vscode.window.visibleTextEditors.filter(editor => {
      return editor.document.uri.path === this.codemoStream.fileName;
    });
    return editor.length && editor[0].document.uri;
  }

  onStreamData(stream) {
    this.remoteEdit = stream.val().lastEdit || { hash: null };

    const edit = new vscode.WorkspaceEdit();
    const editor = this.getEditor();

    if(editor && this.remoteEdit.hash && this.remoteEdit.hash !== this.localEdit.hash) {
      edit.set(editor, [StreamEdit.create(this.remoteEdit)])
      vscode.workspace.applyEdit(edit);
    }
  }

  onEditorTextChange(event) {
    if (event.document !== this.codemoStream) return;

    const edit = event.contentChanges[0];
    this.localEdit = StreamEdit.save(edit);

    if (this.localEdit.hash !== this.remoteEdit.hash) {
      firebase.database().ref(`/streams/${this.stream.key}`)
        .update({
        text: this.codemoStream.getText(),
        lastEdit: this.localEdit
      })
    }
  }
}

export default StreamEventHandler;