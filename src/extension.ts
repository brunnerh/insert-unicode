'use strict';
import * as vscode from 'vscode';
import { codesToDecimal, codesToHex, codesToText } from './utility/code-conversion';
import { hexToText } from './commands/hex-to-text';
import { identifyCharacters } from './commands/identify-characters';
import { insertCommandFactory } from './commands/insert-character';
import { insertFavoriteCommandFactory } from './commands/insert-favorite';
import { insertFont } from './commands/insert-font';

export function activate(context: vscode.ExtensionContext)
{
	const register = vscode.commands.registerTextEditorCommand;

	const tokens = [
		register('insert-unicode.insertText', insertCommandFactory(codesToText, false)),
		register('insert-unicode.insertTextExact', insertCommandFactory(codesToText, true)),
		register('insert-unicode.insertCode', insertCommandFactory(codesToHex, false)),
		register('insert-unicode.insertCodeExact', insertCommandFactory(codesToHex, true)),
		register('insert-unicode.insertDecimalCode', insertCommandFactory(codesToDecimal, false)),
		register('insert-unicode.insertDecimalCodeExact', insertCommandFactory(codesToDecimal, true)),

		register('insert-unicode.insertFavoriteText', insertFavoriteCommandFactory(codesToText)),
		register('insert-unicode.insertFavoriteDecimalCode', insertFavoriteCommandFactory(codesToDecimal)),
		register('insert-unicode.insertFavoriteHexCode', insertFavoriteCommandFactory(codesToHex)),

		register('insert-unicode.insertFont', insertFont),
		register('insert-unicode.fromHexCode', hexToText),
		register('insert-unicode.identify', identifyCharacters),
	];

	context.subscriptions.push(...tokens);
}

export function deactivate()
{
}
