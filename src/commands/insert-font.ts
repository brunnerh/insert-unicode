import { QuickPickItem, window } from 'vscode';
import { Config } from '../config-interface';
import { CommandCallback } from "./command-callback";

export const insertFont: CommandCallback = async (editor, edit, ...args) =>
{
	var fontStyle = <string | object>args[0];

	type Style = {
		label: string;
		A: number;
		a?: number;
		space: number;
	};

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
		const item = await window.showQuickPick(fontStyles.map(style => <QuickPickItem & { style: Style; }>{
			label: convertText(style.label, style),
			description: style.label,
			style: style
		}),
			{
				matchOnDescription: true
			});

		return item === undefined ? undefined : item.style;
	};

	const insert = async (style: Style) =>
	{
		if (editor.selection.isEmpty)
		{
			const text = await window.showInputBox({
				prompt: "Text to insert."
			});

			if (text === undefined)
				return;

			const insertText = convertText(text, style);
			editor.edit(edit => edit.insert(editor.selection.start, insertText));
		}
		else
		{
			const text = editor.document.getText(editor.selection);
			const replacementText = convertText(text, style);
			editor.edit(edit => edit.replace(editor.selection, replacementText));
		}
	};

	let style: Style;
	if (typeof fontStyle === 'string')
	{
		style = fontStyles.filter(style => style.label === fontStyle)[0];
		if (style === undefined)
		{
			window.showErrorMessage(`Unknown font style argument: ${fontStyle}.\nKnown styles: ${fontStyles.map(s => s.label).join(", ")}`);
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
