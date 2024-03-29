import { QuickPickOptions, window } from 'vscode';
import { Config } from '../config';
import { UnicodeEntry, data } from '../data';
import { insert } from '../utility/editor';
import { UnicodeQuickPickItem, showPaginatedQuickPick, unicodeEntryToQuickPick } from '../utility/quick-pick';
import { CommandCallback } from './command-callback';
import { isSkinToneModifier } from '../utility/code-operations';
import { RecentlyUsed } from '../utility/recently-used-list';

const allQuickPicks = data.map(unicodeEntryToQuickPick);

const quickPicksByFilter = new Map<Function | null, UnicodeQuickPickItem[]>([
	[null, allQuickPicks],
]);

function getQuickPicks(preFilter: ((item: UnicodeEntry) => boolean) | null)
{
	if (quickPicksByFilter.has(preFilter) === false)
		quickPicksByFilter.set(preFilter, allQuickPicks.filter(item => preFilter!(item.entry)));

	return quickPicksByFilter.get(preFilter)!;
}

/**
 * Gets the quick picks for the characters according to user settings.
 * @param preFilter Filter that is always applied to the list of characters.
 * @returns The quick picks for the characters.
 */
function getUserQuickPicks(preFilter: ((item: UnicodeEntry) => boolean) | null)
{
	let picks = getQuickPicks(preFilter).slice();

	if (Config.section.get('include-sequences') === false)
		picks = picks.filter(item => item.entry.codes.length === 1);

	if (Config.section.get('include-skin-tone-variants') === false)
		picks = picks.filter(item => item.entry.codes.length === 1
			|| item.entry.codes.some(isSkinToneModifier) === false);

	if (Config.section.get('enableAliases') === false)
		picks = picks.map(p =>
		{
			const copy = { ...p };
			delete copy.detail;

			return copy;
		});

	const recentlyUsed = RecentlyUsed.get();
	const recentlyUsedSet = new Set(recentlyUsed);
	const sortValue = (item: typeof picks[number]) =>
		recentlyUsedSet.has(item.entry.name) ?
			recentlyUsed.indexOf(item.entry.name) :
			Number.MAX_SAFE_INTEGER;

	picks.sort((a, b) => sortValue(a) - sortValue(b));

	return picks;
};

/**
 * Creates a command function with the specified settings.
 * @param codeConverter Conversion from selected Unicode code to text to insert into the editor.
 * @param preFilter Filter that is always applied to the list of characters.
 * @param matchExact Whether to search the Unicode characters for the exact search term.
 */
export const insertCommandFactory = (
	codeConverter: (codes: number[]) => string,
	preFilter: ((item: UnicodeEntry) => boolean) | null,
	matchExact: boolean,
): CommandCallback =>
	async (editor, _edit, ...args) =>
	{
		const search = <string | object>args[0];
		const disableFiltering = Config.section.get("disable-pre-filtering");

		/**
		 * Prompts the user for an initial search term.
		 * @param search Pre-filled search term.
		 * @param prompt The prompt text above the search input.
		 */
		const filter = async (search?: string, prompt?: string) =>
		{
			const filter = await window.showInputBox({
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
			let pickItems = getUserQuickPicks(preFilter);

			if (search !== undefined)
			{
				const searchNormalized = search.toUpperCase();
				pickItems = pickItems.filter(quickPick => matchExact
					? quickPick.entry.name.toUpperCase() === searchNormalized
					: quickPick.entry.name.toUpperCase().indexOf(searchNormalized) !== -1
				);

				// Instant insert on exact match
				if (pickItems.length === 1)
				{
					const entry = pickItems[0].entry;
					insert(editor, entry, codeConverter(entry.codes));
					return;
				}

				if (pickItems.length === 0)
				{
					await filter(search, `No items found for "${search}".`);
					return;
				}
			}

			const quickPickOptions = <QuickPickOptions>{
				matchOnDescription: true,
				matchOnDetail: true,
				placeHolder: disableFiltering ? '' :
					`Results for "${search}" (${pickItems.length}). (Press ESC to search for another term.)`,
				pageSize: Config.section.get("page-size")
			};

			const selection = await (
				disableFiltering
					? window.showQuickPick(pickItems, quickPickOptions)
					: showPaginatedQuickPick(pickItems, quickPickOptions)
			);

			if (selection !== undefined)
				await insert(editor, selection.entry, codeConverter(selection.entry.codes));
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
