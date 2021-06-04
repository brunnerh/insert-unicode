import * as vscode from "vscode";
import type { ConfigurationTarget } from "vscode";
import type { UnicodeEntry } from './data';
import { isSkintoneModifier } from './utility/code-operations';

export class Config
{
	static readonly sectionName = 'insert-unicode';

	static get section(): TypedConfig
	{
		return vscode.workspace.getConfiguration(this.sectionName);
	}

	/**
	 * Filters Unicode entries according to the current configuration.
	 * @param entries The entries to filter.
	 * @returns Filtered list of entries.
	 */
	static filterData(entries: UnicodeEntry[])
	{
		let filtered = entries;

		if (Config.section.get('include-sequences') === false)
			filtered = filtered.filter(entry => entry.codes.length === 1);

		if (Config.section.get('include-skin-tone-variants') === false)
			filtered = filtered.filter(entry => entry.codes.length === 1
				|| entry.codes.some(isSkintoneModifier) === false);

		return filtered;
	}
}

export interface ConfigTypeMap
{
	'page-size': number;
	'unicode-font-use-regular-space': boolean;
	'disable-pre-filtering': boolean;
	'include-sequences': boolean;
	'include-skin-tone-variants': boolean;
	'show-identified-characters-in-file': boolean;
	'favorites': FavoritesNode;
	'favoritesScopeBehavior': 'merge' | 'separate';
	'identifyViewUpdateDelay': number;
	'identifyViewCharacterLimit': number;
	'enableAliases': boolean;
	'enableRecentlyUsed': boolean;
	'recentlyUsedLimit': number;
}

interface InspectResult<T>
{
		key: string;

		defaultValue?: T;
		globalValue?: T;
		workspaceValue?: T;
		workspaceFolderValue?: T;

		defaultLanguageValue?: T;
		globalLanguageValue?: T;
		workspaceLanguageValue?: T;
		workspaceFolderLanguageValue?: T;

		languageIds?: string[];
}

interface TypedConfig
{
	get<K extends keyof ConfigTypeMap>(item: K): ConfigTypeMap[K];
	inspect<K extends keyof ConfigTypeMap>(item: K): InspectResult<ConfigTypeMap[K]> | undefined;
	update<K extends keyof ConfigTypeMap>(
		item: K,
		value: ConfigTypeMap[K],
		configurationTarget?: ConfigurationTarget | boolean,
		overrideInLanguage?: boolean)
		: Thenable<void>;
}

export interface FavoritesNode
{
	directories?: Record<string, FavoritesNode>;

	items?: (number | string)[][];
}