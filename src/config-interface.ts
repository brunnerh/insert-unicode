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
}