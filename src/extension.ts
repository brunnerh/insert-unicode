'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { data } from './data';
import { Config } from './config-interface';
import { TextEditor, TextEditorEdit } from 'vscode';
import { showPaginatedQuickPick } from './utility';

const codeToHex = (code: number) => `0x${code.toString(16)}`;
const codeToText = (code: number) => String.fromCodePoint(code);

const insertCommandFactory = (codeConverter: (code: number) => string, matchExact: boolean) =>
	async (editor: TextEditor, edit: TextEditorEdit, ...args: any[]) =>
	{
		var search = <string | object>args[0];

		const insert = (value: string) =>
			editor.edit(builder => editor.selection.isEmpty ?
					builder.insert(editor.selection.active, value) : builder.replace(editor.selection, value));

		const filter = async (search?: string, prompt?: string) =>
		{
			const filter = await vscode.window.showInputBox({
				placeHolder: 'e.g. "ok hand"',
				prompt: prompt === undefined ? "Enter a search term." : prompt,
				value: search
			});

			if (filter === undefined)
				return;

			await select(filter);
		};

		const select = async (search: string) =>
		{
			const searchNormalized = search.toUpperCase();

			const items = data.filter(item => matchExact ?
				item.name === searchNormalized : item.name.indexOf(searchNormalized) !== -1);

			// Instant insert on exact match
			if (items.length === 1)
			{
				await insert(codeConverter(items[0].code));
				return;
			}

			if (items.length === 0)
			{
				await filter(search, `No items found for "${search}".`);
				return;
			}

			const pickItems = items.map(item => ({
				label: String.fromCodePoint(item.code),
				description: `${codeToHex(item.code)} - ${item.name}`,
				code: item.code
			}));

			const selection = await showPaginatedQuickPick(pickItems, {
				matchOnDescription: true,
				placeHolder: `Results for "${search}" (${items.length}). (Press ESC to search for another term.)`,
				pageSize: Config.section.get("page-size")
			});

			if (selection === undefined)
				// Go back to search.
				await filter(search);
			else
				await insert(codeConverter(selection.code));
		};

		if (typeof search === 'string')
			await select(search);
		else
			await filter();
	};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext)
{
	let tokens = [
		vscode.commands.registerTextEditorCommand('insert-unicode.insertText', insertCommandFactory(codeToText, false)),
		vscode.commands.registerTextEditorCommand('insert-unicode.insertTextExact', insertCommandFactory(codeToText, true)),
		vscode.commands.registerTextEditorCommand('insert-unicode.insertCode', insertCommandFactory(codeToHex, false)),
		vscode.commands.registerTextEditorCommand('insert-unicode.insertCodeExact', insertCommandFactory(codeToHex, true)),
	];

	context.subscriptions.push(...tokens);
}

// this method is called when your extension is deactivated
export function deactivate()
{
}