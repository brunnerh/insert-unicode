import { TextEditor, TextEditorEdit } from 'vscode';

export type CommandCallback = (textEditor: TextEditor, edit: TextEditorEdit, ...args: any[]) => void;
