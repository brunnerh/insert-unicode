import { TextEditor } from 'vscode';

export const insert = (editor: TextEditor, value: string) => editor.edit(builder => editor.selection.isEmpty ?
	builder.insert(editor.selection.active, value) : builder.replace(editor.selection, value));
