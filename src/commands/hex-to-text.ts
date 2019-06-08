import { window } from 'vscode';
import { data } from '../data';
import { insert } from "../utility/editor";
import { codesToText } from "./code-conversion";
import { CommandCallback } from './command-callback';

const findEntry = (search: string) => data.find(item => item.codes.length === 1 && item.codes[0] === parseInt(search, 16));

export const hexToText: CommandCallback = async (editor) =>
{
	const code = await window.showInputBox({
		placeHolder: 'e.g. "1f525" for the FIRE Unicode character.',
		validateInput: value => value.match(/^[0-9a-f]*$/i) === null ? 'Input does not match number in hexadecimal.' :
			findEntry(value) === undefined ? 'No character exists for this hex code.' : null,
	});

	if (code === undefined)
		return;

	const entry = findEntry(code)!;

	insert(editor, codesToText(entry.codes));
};
