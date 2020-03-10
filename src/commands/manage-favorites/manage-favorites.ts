import { window, ViewColumn, workspace, Uri, ExtensionContext } from "vscode";
import { Config } from "../../config-interface";
import { FavoritesViewMessage } from "./favorites-view-message";
import { FavoritesBackEndMessage } from "./favorites-back-end-message";
import * as path from 'path';
import { isSkintoneModifier } from "../../utility/code-operations";

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

	const viewScriptRoot = view.webview.asWebviewUri(
		Uri.file(path.join(context.extensionPath, 'out', 'commands', 'manage-favorites'))
	);
	view.webview.html = html(viewScriptRoot.toString() + '/');

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
			case 'get-unicode-data':
				const dataModule = await import('../../data');

				let entries = dataModule.data;

				if (Config.section.get('include-sequences') === false)
					entries = entries.filter(entry => entry.codes.length === 1);

				if (Config.section.get('include-skin-tone-variants') === false)
					entries = entries.filter(entry => entry.codes.length === 1
						|| entry.codes.some(isSkintoneModifier) === false);

				postMessage({ type: 'unicode-data', data: entries });
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

const html = (scriptRoot: string) => /*html*/`
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<meta http-equiv="Content-Security-Policy"
				content="default-src 'self' vscode-resource: https:;
					script-src vscode-resource: 'self' 'unsafe-inline' 'unsafe-eval' https:;
					style-src vscode-resource: 'self' 'unsafe-inline';
					img-src 'self' vscode-resource: data:"/>
			<base href="${scriptRoot}">
			<title>Manage Unicode Favorites</title>
		</head>
		<body>
			<script src="./view.js"></script>
		</body>
	</html>
`;