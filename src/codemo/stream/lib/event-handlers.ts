import * as vscode from 'vscode';
import * as firebase from 'firebase';
import * as _get from 'lodash.get';

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
    this.onEditorTextChange = this.onEditorTextChange.bind(this);
  }

  getEditor() {
    const editor = vscode.window.visibleTextEditors.find(editor => {
      return editor.document.uri.path === this.codemoStream.fileName;
    });

    return _get(editor, 'document.uri');
  }

  onStreamData(stream) {
    this.remoteEdit = stream.val().lastEdit;

    const edit = new vscode.WorkspaceEdit();
    const editor = this.getEditor();

    if (!editor || !_get(this.remoteEdit, 'hash')) return;

    if(this.remoteEdit.hash !== _get(this.localEdit, 'hash')) {
      edit.set(editor, [StreamEdit.create(this.remoteEdit)])
      vscode.workspace.applyEdit(edit);
    }
  }

  onEditorTextChange(event) {
    if (event.document !== this.codemoStream) return;

    const edit = event.contentChanges[0];
    this.localEdit = StreamEdit.save(edit);

    if (this.localEdit.hash !== _get(this.remoteEdit, 'hash')) {
      firebase.database().ref(`/streams/${this.stream.key}`)
        .update({
        text: this.codemoStream.getText(),
        lastEdit: this.localEdit
      })
    }
  }
}

export default StreamEventHandler;
