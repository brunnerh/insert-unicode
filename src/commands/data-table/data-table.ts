import { workspace, window, ViewColumn, Uri, ExtensionContext } from "vscode";
import { Config } from "../../config";
import type { DataTableViewMessage } from "./data-table-view-message";
import type { DataTableBackEndMessage } from "./data-table-back-end-message";
import * as path from 'path';
import { MessageInstance } from '../svelte/utility/message-bus';
import { vscode } from '../svelte/utility/vscode-api';

export const dataTable = (context: ExtensionContext) => async () =>
{
	const title = 'Unicode Data Table';

	const view = window.createWebviewPanel(
		'insert-unicode-data-table',
		title,
		ViewColumn.Active,
		{
			enableScripts: true,
			localResourceRoots: [Uri.file(context.extensionPath)],
		},
	);

	const viewScriptRoot = view.webview.asWebviewUri(
		Uri.file(path.join(context.extensionPath, 'out', 'commands', 'data-table'))
	);
	view.webview.html = html(viewScriptRoot.toString() + '/');

	const postMessage = (message: DataTableBackEndMessage & MessageInstance) =>
		view.webview.postMessage(message);

	const dataModule = await import('../../data');

	view.webview.onDidReceiveMessage(async (message: DataTableViewMessage & MessageInstance) =>
	{
		const respond = (response: DataTableBackEndMessage) =>
			postMessage({
				...response,
				sequenceNumber: message.sequenceNumber,
			});

		switch (message.type)
		{
			case 'get-unicode-data':
				respond({ type: 'unicode-data', data: Config.filterData(dataModule.data) });
				break;
			default:
				break;
		}
	});

	const updateHandlers = [
		workspace.onDidChangeConfiguration(async e =>
		{
			if (e.affectsConfiguration(Config.sectionName))
				postMessage({
					type: 'unicode-data',
					data: Config.filterData(dataModule.data),
					sequenceNumber: -1,
				});
		}),
	];

	view.onDidDispose(() => updateHandlers.forEach(h => h.dispose()));
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
			<title>Unicode Data Table</title>
		</head>
		<body>
			<script src="./view.js"></script>
		</body>
	</html>
`;
