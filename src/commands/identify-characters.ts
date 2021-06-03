import { ViewColumn, window, workspace } from 'vscode';
import { Config } from '../config';
import { data } from '../data';
import { codesToHex } from "../utility/code-conversion";
import { CommandCallback } from "./command-callback";

export const identifyCharacters: CommandCallback = async (editor) =>
{
	const text =  editor.selection.isEmpty ?
		await window.showInputBox({ prompt: 'Characters to identify.' }) :
		editor.document.getText(editor.selection);

	if (text === undefined)
		return;

	const message = identify(text)
		.map(item => item.entry === undefined
			? `Unknown character code: ${codesToHex([item.code])}`
			: `${item.char}: ${item.entry.name} (${codesToHex([item.code])})`)
		.join('\n');

	let showFile: boolean = Config.section.get('show-identified-characters-in-file');
	if (showFile === false)
		showFile = (await window.showInformationMessage(message, 'Show in New File')) !== undefined;

	if (showFile)
	{
		const document = await workspace.openTextDocument({
			content: message,
		});
		await window.showTextDocument(document, ViewColumn.Two);
	}
};

/**
 * Identifies Unicode characters of a string.
 * @param text The text whose characters should be identified.
 * @returns
 *     List of characters and their Unicode entries.
 *     `entry` is `undefined` if it could not be found.
 */
export function identify(text: string)
{
	return Array.from(text)
		.map(char => ({
			char,
			code: char.codePointAt(0) ? char.codePointAt(0)! : char.charCodeAt(0)
		}))
		.map(item => ({
			...item,
			entry: data.find(d => d.codes.length === 1 && d.codes[0] === item.code)
		}));
}

