import { QuickPickItem, window } from "vscode";
import { Config, FavoritesNode } from '../config';
import { data } from '../data';
import { insert } from "../utility/editor";
import { empty, merge } from "../utility/favorites";
import { unicodeEntryToQuickPick } from "../utility/quick-pick";
import { CommandCallback } from "./command-callback";

type HierarchicalFavoritesNode = FavoritesNode & { parent?: FavoritesNode };

export const insertFavoriteCommandFactory = (codeConverter: (codes: number[]) => string): CommandCallback =>
	async (editor) =>
	{
		const showNode = async (node: HierarchicalFavoritesNode) =>
		{
			const picks: (QuickPickItem & { onSelected: () => Promise<void> })[] = [];
			if (node.directories)
			{
				for (let key in node.directories)
				{
					const directory = <HierarchicalFavoritesNode>node.directories[key];
					directory.parent = node;

					picks.push({
						label: `$(file-directory) ${key}`,
						onSelected: async () =>
						{
							const success = await showNode(directory);
							if (success === false)
								await showNode(node);
						}
					});
				}
			}
			if (node.items)
			{
				for (const codes of node.items)
				{
					// JSON does not support hex numbers (0x...), so it has to be parsed from a string.
					const normalized = codes.map(c => typeof c === 'number' ? c : parseInt(c));

					let entry = data.find(entry =>
						entry.codes.length === normalized.length &&
						entry.codes.every((c, i) => c === normalized[i]));

					// Get individual Unicode character names and create synthetic entry.
					if (entry === undefined)
					{
						const names = normalized
							.map(code => data.find(entry => entry.codes.length === 1 && entry.codes[0] === code))
							.map(entry => entry === undefined ? '?' : entry.name);

						entry = {
							codes: normalized,
							name: `[${names.join(', ')}]`,
							aliases: [],
						};
					}

					const item = {
						...unicodeEntryToQuickPick(entry),
						onSelected: () => insert(editor, entry!, codeConverter(normalized)),
					};

					picks.push(item);
				}
			}

			if (picks.length === 0)
			{
				window.showWarningMessage("Directory is empty.");
				return false;
			}

			if (node.parent !== undefined)
				picks.unshift({
					label: '$(arrow-left) ..',
					onSelected: async () =>
					{
						await showNode(node.parent!);
					},
				});

			const selection = await window.showQuickPick(picks, { matchOnDescription: true });
			if (selection === undefined)
				return true;

			await selection.onSelected();
			return true;
		};

		const favorites = Config.section.inspect('favorites')!;

		const sets = [
			{
				label: 'User Settings',
				favorites: favorites.globalValue,
			},
			{
				label: 'Workspace Settings',
				favorites: favorites.workspaceValue,
			}
		].filter(s => s.favorites !== undefined && empty(s.favorites) === false);

		if (sets.length === 0)
		{
			await showNode(favorites.defaultValue!);
		}
		else if (sets.length === 1)
		{
			await showNode(sets[0].favorites!);
		}
		else
		{
			const behavior = Config.section.get('favoritesScopeBehavior');
			switch (behavior)
			{
				case 'merge':
					await showNode(merge(sets.map(s => s.favorites!)));
					break;
				case 'separate':
					await showNode({
						directories: Object.fromEntries(sets.map(s => [s.label, s.favorites!])),
					});
					break;
				default:
					window.showErrorMessage(`Unknown "favoritesScopeBehavior" setting: ${behavior}`);
			}
		}
	};