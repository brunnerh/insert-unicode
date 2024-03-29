'use strict';
import * as vscode from 'vscode';
import { dataTable } from './commands/data-table';
import { hexToText } from './commands/hex-to-text';
import { identifyCharacters } from './commands/identify-characters';
import { insertCommandFactory } from './commands/insert-character';
import { insertFavoriteCommandFactory } from './commands/insert-favorite';
import { insertFont } from './commands/insert-font';
import { manageFavorites } from './commands/manage-favorites';
import { clearRecentlyUsed } from './commands/recently-used';
import { Context } from './context';
import { UnicodeEntry } from './data';
import { migrate } from './migrations';
import { Keys } from './state';
import { codesToDecimal, codesToHex, codesToText } from './utility/code-conversion';
import { isEmoji } from './utility/code-operations';
import { IdentifyViewProvider } from './views/identify-view';

export function activate(context: vscode.ExtensionContext)
{
	console.log('Unicode Tools activated.')
	Context.set(context);

	const previousVersion = context.globalState.get<string>(Keys.lastVersion);
	const currentVersion = context.extension.packageJSON.version;
	context.globalState.update(Keys.lastVersion, currentVersion);
	migrate(previousVersion, currentVersion);

	const register = vscode.commands.registerTextEditorCommand;

	const emojiFilter = (item: UnicodeEntry) => isEmoji(item.codes);

	const tokens = [
		register('insert-unicode.insertText', insertCommandFactory(codesToText, null, false)),
		register('insert-unicode.insertTextExact', insertCommandFactory(codesToText, null, true)),
		register('insert-unicode.insertCode', insertCommandFactory(codesToHex, null, false)),
		register('insert-unicode.insertCodeExact', insertCommandFactory(codesToHex, null, true)),
		register('insert-unicode.insertDecimalCode', insertCommandFactory(codesToDecimal, null, false)),
		register('insert-unicode.insertDecimalCodeExact', insertCommandFactory(codesToDecimal, null, true)),
		register('insert-unicode.insertEmojiText', insertCommandFactory(codesToText, emojiFilter, false)),
		register('insert-unicode.insertEmojiDecimalCode', insertCommandFactory(codesToDecimal, emojiFilter, false)),
		register('insert-unicode.insertEmojiHexCode', insertCommandFactory(codesToHex, emojiFilter, false)),

		register('insert-unicode.insertFavoriteText', insertFavoriteCommandFactory(codesToText)),
		register('insert-unicode.insertFavoriteDecimalCode', insertFavoriteCommandFactory(codesToDecimal)),
		register('insert-unicode.insertFavoriteHexCode', insertFavoriteCommandFactory(codesToHex)),
		vscode.commands.registerCommand('insert-unicode.manageFavorites', manageFavorites),

		register('insert-unicode.insertFont', insertFont),
		register('insert-unicode.fromHexCode', hexToText),
		register('insert-unicode.identify', identifyCharacters),

		vscode.commands.registerCommand('insert-unicode.dataTable', dataTable),
		vscode.commands.registerCommand('insert-unicode.clearRecentlyUsed', clearRecentlyUsed),

		new IdentifyViewProvider(context.extensionUri).register(),
	];

	context.subscriptions.push(...tokens);
}

export function deactivate()
{
}
