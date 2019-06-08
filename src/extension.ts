'use strict';
import * as vscode from 'vscode';
import { codesToHex, codesToText } from './commands/code-conversion';
import { hexToText } from './commands/hex-to-text';
import { identifyCharacters } from './commands/identify-characters';
import { insertFont } from './commands/insert-font';
import { insertCommandFactory } from './commands/insert-character';

export function activate(context: vscode.ExtensionContext)
{
	const register = vscode.commands.registerTextEditorCommand;

	const tokens = [
		register('insert-unicode.insertText', insertCommandFactory(codesToText, false)),
		register('insert-unicode.insertTextExact', insertCommandFactory(codesToText, true)),
		register('insert-unicode.insertCode', insertCommandFactory(codesToHex, false)),
		register('insert-unicode.insertCodeExact', insertCommandFactory(codesToHex, true)),

		register('insert-unicode.insertFont', insertFont),
		register('insert-unicode.fromHexCode', hexToText),
		register('insert-unicode.identify', identifyCharacters),
	];

	context.subscriptions.push(...tokens);
}

export function deactivate()
{
}
