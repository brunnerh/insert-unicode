import * as vscode from "vscode";
import type { ConfigurationTarget } from "vscode";

export class Config
{
	static get section(): TypedConfig
	{
		return vscode.workspace.getConfiguration("insert-unicode");
	}
}

interface TypeMap
{
	"page-size": number;
	"unicode-font-use-regular-space": boolean;
	"disable-pre-filtering": boolean;
	"include-sequences": boolean;
	"include-skin-tone-variants": boolean;
	"show-identified-characters-in-file": boolean;
	"favorites": FavoritesNode;
	"favoritesScopeBehavior": 'merge' | 'separate';
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
	get<K extends keyof TypeMap>(item: K): TypeMap[K];
	inspect<K extends keyof TypeMap>(item: K): InspectResult<TypeMap[K]> | undefined;
	update<K extends keyof TypeMap>(
		item: K,
		value: TypeMap[K],
		configurationTarget?: ConfigurationTarget | boolean,
		overrideInLanguage?: boolean)
		: Thenable<void>;
}

export interface FavoritesNode
{
	directories?: Record<string, FavoritesNode>;

	items?: (number | string)[][];
}