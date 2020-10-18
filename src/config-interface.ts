import * as vscode from "vscode";
import type { ConfigurationTarget } from "vscode";

export class Config
{
	static readonly sectionName = 'insert-unicode';

	static get section(): TypedConfig
	{
		return vscode.workspace.getConfiguration(this.sectionName);
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