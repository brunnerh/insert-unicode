'use strict';
import * as vscode from 'vscode';
import { data } from './data';
import { Config } from './config-interface';
import { TextEditor, TextEditorEdit } from 'vscode';
import { showPaginatedQuickPick } from './utility';

const codeToHex = (code: number) => `0x${code.toString(16)}`;
const codeToText = (code: number) => String.fromCodePoint(code);

const allDataQuickPicks = data.map(entry => ({
	label: String.fromCodePoint(entry.code),
	description: `${codeToHex(entry.code)} - ${entry.name}`,
	entry
}));

/**
 * Creates a command function with the specified settings.
 * @param codeConverter Conversion from selected Unicode code to text to insert into the editor.
 * @param matchExact Whether to search the Unicode characters for the exact search term.
 */
const insertCommandFactory = (codeConverter: (code: number) => string, matchExact: boolean) =>
	async (editor: TextEditor, _edit: TextEditorEdit, ...args: any[]) =>
	{
		const search = <string | object>args[0];
		const disableFiltering = Config.section.get("disable-pre-filtering");

		const insert = (value: string) =>
			editor.edit(builder => editor.selection.isEmpty ?
				builder.insert(editor.selection.active, value) : builder.replace(editor.selection, value));

		/**
		 * Prompts the user for an initial search term.
		 * @param search Pre-filled search term.
		 * @param prompt The prompt text above the search input.
		 */
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

		/**
		 * Shows a filtered selection list from which to choose a character.
		 * @param search The search term to which to limit the list of characters to choose from.
		 */
		const select = async (search?: string) =>
		{
			let pickItems = allDataQuickPicks;

			if (search !== undefined)
			{
				const searchNormalized = search.toUpperCase();
				pickItems = allDataQuickPicks.filter(quickPick =>
					matchExact
						? quickPick.entry.name === searchNormalized
						: quickPick.entry.name.indexOf(searchNormalized) !== -1
				);

				// Instant insert on exact match
				if (pickItems.length === 1)
				{
					await insert(codeConverter(pickItems[0].entry.code));
					return;
				}

				if (pickItems.length === 0)
				{
					await filter(search, `No items found for "${search}".`);
					return;
				}
			}

			const quickPickOptions = <vscode.QuickPickOptions>{
				matchOnDescription: true,
				placeHolder: disableFiltering ? '' :
					`Results for "${search}" (${pickItems.length}). (Press ESC to search for another term.)`,
				pageSize: Config.section.get("page-size")
			};

			const selection = await (
				disableFiltering
					? vscode.window.showQuickPick(pickItems, quickPickOptions)
					: showPaginatedQuickPick(pickItems, quickPickOptions)
			);

			if (selection !== undefined)
				await insert(codeConverter(selection.entry.code));
			else if (disableFiltering === false)
				// Go back to search.
				await filter(search);
		};

		if (typeof search === 'string')
			await select(search);
		else if (disableFiltering)
			await select();
		else
			await filter();
	};

const insertFont = async (editor: TextEditor, _edit: TextEditorEdit, ...args: any[]) =>
{
	var fontStyle = <string | object>args[0];

	type Style = { label: string, A: number, a?: number, space: number };

	const spaceCode = ' '.charCodeAt(0);
	const ACode = 'A'.charCodeAt(0);
	const aCode = 'a'.charCodeAt(0);
	const ZCode = 'Z'.charCodeAt(0);
	const zCode = 'z'.charCodeAt(0);

	const enSpace = 0x2002;
	const emSpace = 0x2003;

	const fontStyles: Style[] = [
		{ label: "Math Bold", A: 0x1D400, a: 0x1D41A, space: spaceCode },
		{ label: "Math Italic", A: 0x1D434, a: 0x1D44E, space: spaceCode },
		{ label: "Math Bold Italic", A: 0x1D468, a: 0x1D482, space: spaceCode },
		{ label: "Math Script", A: 0x1D49C, a: 0x1D4B6, space: spaceCode },
		{ label: "Math Script Bold", A: 0x1D4D0, a: 0x1D4EA, space: enSpace },
		{ label: "Math Fraktur", A: 0x1D504, a: 0x1D51E, space: spaceCode },
		{ label: "Math Fraktur Bold", A: 0x1D56C, a: 0x1D586, space: enSpace },
		{ label: "Math Double-Struck", A: 0x1D538, a: 0x1D552, space: enSpace },
		{ label: "Math Sans-Serif", A: 0x1D5A0, a: 0x1D5BA, space: spaceCode },
		{ label: "Math Sans-Serif Bold", A: 0x1D5D4, a: 0x1D5EE, space: spaceCode },
		{ label: "Math Sans-Serif Italic", A: 0x1D608, a: 0x1D622, space: spaceCode },
		{ label: "Math Sans-Serif Bold Italic", A: 0x1D63C, a: 0x1D656, space: spaceCode },
		{ label: "Math Monospace", A: 0x1D670, a: 0x1D68A, space: spaceCode },
		{ label: "Squared Latin", A: 0x1F130, space: emSpace },
		{ label: "Negative Circled Latin", A: 0x1F150, space: emSpace },
		{ label: "Negative Squared Latin", A: 0x1F170, space: emSpace },
	];

	const convertText = (text: string, style: Style) =>
	{
		const spaceReplacement = Config.section.get("unicode-font-use-regular-space") ?
			spaceCode : style.space;

		return text.split('').map(e =>
		{
			const c = e.charCodeAt(0);
			return c === spaceCode ? spaceReplacement :
				c >= ACode && c <= ZCode ? (c - ACode + style.A) :
					c >= aCode && c <= zCode ? (c - aCode + (style.a === undefined ? style.A : style.a)) : c;
		}).map(c => String.fromCodePoint(c)).join("");
	};

	const pickStyle = async () =>
	{
		const item = await vscode.window.showQuickPick(
			fontStyles.map(style => <vscode.QuickPickItem & { style: Style }>{
				label: convertText(style.label, style),
				description: style.label,
				style: style
			}), {
				matchOnDescription: true
			}
		);

		return item === undefined ? undefined : item.style;
	};

	const insert = async (style: Style) =>
	{
		if (editor.selection.isEmpty)
		{
			const text = await vscode.window.showInputBox({
				prompt: "Text to insert."
			});

			if (text === undefined)
				return;

			const insertText = convertText(text, style);
			editor.edit(edit =>
				edit.insert(editor.selection.start, insertText)
			);
		}
		else
		{
			const text = editor.document.getText(editor.selection);
			const replacementText = convertText(text, style);
			editor.edit(edit =>
				edit.replace(editor.selection, replacementText)
			);
		}
	};

	let style: Style;
	if (typeof fontStyle === 'string')
	{
		style = fontStyles.filter(style => style.label === fontStyle)[0];
		if (style === undefined)
		{
			vscode.window.showErrorMessage(`Unknown font style argument: ${fontStyle}.\nKnown styles: ${fontStyles.map(s => s.label).join(", ")}`);
			return;
		}
	}
	else
	{
		const selection = await pickStyle();
		if (selection === undefined)
			return;

		style = selection;
	}

	await insert(style);
};

export function activate(context: vscode.ExtensionContext)
{
	const register = vscode.commands.registerTextEditorCommand;

	const tokens = [
		register('insert-unicode.insertText', insertCommandFactory(codeToText, false)),
		register('insert-unicode.insertTextExact', insertCommandFactory(codeToText, true)),
		register('insert-unicode.insertCode', insertCommandFactory(codeToHex, false)),
		register('insert-unicode.insertCodeExact', insertCommandFactory(codeToHex, true)),
		register('insert-unicode.insertFont', insertFont),
	];

	context.subscriptions.push(...tokens);
}

export function deactivate()
{
}
