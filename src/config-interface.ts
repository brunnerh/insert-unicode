import * as vscode from "vscode";

export class Config
{
	static get section(): vscode.WorkspaceConfiguration & TypedConfig
	{
		return vscode.workspace.getConfiguration("insert-unicode");
	}
}

interface TypedConfig
{
	get(item: "page-size"): number;
	get(item: "unicode-font-use-regular-space"): boolean;
	get(item: "disable-pre-filtering"): boolean;
	get(item: "include-sequences"): boolean;
	get(item: "include-skin-tone-variants"): boolean;
}