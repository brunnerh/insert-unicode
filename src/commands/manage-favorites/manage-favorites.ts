import { window, ViewColumn, workspace, Uri, ExtensionContext } from "vscode";
import { Config } from "../../config-interface";
import { FavoritesViewMessage } from "./favorites-view-message";
import { FavoritesBackEndMessage } from "./favorites-back-end-message";
import * as path from 'path';

export const manageFavorites = (context: ExtensionContext) => () =>
{
	const title = 'Manage Unicode Favorites';

	const view = window.createWebviewPanel(
		'insert-unicode-favorite-manager',
		title,
		ViewColumn.Active,
		{
			enableScripts: true,
			localResourceRoots: [Uri.file(context.extensionPath)],
		},
	);

	const viewScriptPath = 'vscode-resource:' +
		path.join(context.extensionPath, 'out', 'commands', 'manage-favorites', 'view.js');

	view.webview.html = html(viewScriptPath);

	const postMessage = (message: FavoritesBackEndMessage) =>
		view.webview.postMessage(message);

	view.webview.onDidReceiveMessage(async (message: FavoritesViewMessage) =>
	{
		switch (message.type)
		{
			case 'get-favorites':
				const favorites = Config.section.get('favorites');
				postMessage({ type: 'favorites', favorites });
				view.title = title;
				break;
			case 'changed':
				view.title = title + '*';
				break;
			case 'save':
				Config.section.update('favorites', message.favorites);
				view.title = title;
				break;
			default:
				break;
		}
	});
};

const html = (scriptPath: string) => /*html*/`
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Manage Unicode Favorites</title>
		</head>
		<body>
			<script src="${scriptPath}"></script>
		</body>
	</html>
`;