import { CommandCallback } from "./command-callback";
import { window, ViewColumn, workspace } from "vscode";
import { Config } from "../config-interface";

export const manageFavorites: CommandCallback = () =>
{
	const view = window.createWebviewPanel(
		'insert-unicode-favorite-manager',
		'Manage Unicode Favorites',
		ViewColumn.Active,
		{ enableScripts: true });

	const favorites = Config.section.get('favorites');

	view.webview.html = html;

	view.webview.postMessage(favorites); // TODO: do not do this via message, or resend on view reload
}

const html = /*html*/`
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Document</title>
		<style>
			.directory > .contents
			{
				margin-left: 20px;
			}
			.directory > .header > .name
			{
				background: var(--vscode-editor-background);
				color: var(--vscode-editor-foreground);
				border: 1px solid transparent;
				transition: border ease-in-out 0.3s;
			}
			.directory > .header > .name:hover,
			.directory > .header > .name:focus
			{
				border: 1px solid var(--vscode-editor-foreground);
			}

			.dialog
			{
				color: var(--vscode-foreground);
				background: var(--vscode-notifications-background);
				padding: 10px;
				border: none;
				box-shadow: rgb(0, 0, 0) 0px 0px 8px;
			}
			.dialog .dialog-buttons
			{
				margin-top: 5px;
				text-align: right;
			}
			.dialog .dialog-buttons > button
			{
				background: var(--vscode-button-background);
				color: var(--vscode-button-foreground);
				border: none;
				max-width: fit-content;
				padding: 5px 10px;
				margin: 4px 5px;
			}
			.dialog .dialog-buttons > button:hover
			{
				background: var(--vscode-button-hoverBackground);
			}

			.icon-btn
			{
				font-weight: bold;
				background: transparent;
				color: var(--vscode-foreground);
				border: 1px solid transparent;
				transition: border ease-in-out 0.3s;
			}
			.icon-btn:hover,
			.icon-btn:focus
			{
				border: 1px solid var(--vscode-foreground);
			}
		</style>
	</head>
	<body>
		<template id="directory-template">
			<div class="directory">
				<div class="header">
					<input class="name"/>
					<button class="icon-btn delete-btn">X</button>
				</div>
				<div class="contents">
				</div>
			</div>
		</template>

		<template id="dialog-template">
			<dialog class="dialog">
				<div class="dialog-content"></div>
				<div class="dialog-buttons">
					<button class="confirm-btn">OK</button>
					<button class="cancel-btn">Cancel</button>
				</div>
			</dialog>
		</template>

		<div id="tree-root"></div>

		<script>
			(() =>
			{
				const vscode = acquireVsCodeApi();

				const cloneTemplate = selector =>
				{
					const template = document.querySelector(selector);

					return document.importNode(template.content, true).firstElementChild;
				};

				const confirmDialog = content => new Promise(resolve =>
				{
					const dialog = cloneTemplate('#dialog-template');
					dialog.querySelector('.dialog-content').innerHTML = content;

					document.body.appendChild(dialog);

					const hookButton = (selector, value) =>
						dialog.querySelector(selector)
							.addEventListener('click', () => { dialog.close(); resolve(value); });

					hookButton('.dialog-buttons > .confirm-btn', true);
					hookButton('.dialog-buttons > .cancel-btn', false);

					dialog.addEventListener('close', () => dialog.remove());

					dialog.showModal();
				});

				const update = data =>
				{
					const root = document.querySelector('#tree-root');
					root.innerHTML = '';

					root.append(...renderNode(data));
				};
				const renderNode = node =>
				{
					const list = [];

					if (node.directories)
					{
						for (let key in node.directories)
						{
							const container = cloneTemplate('#directory-template');
							const nameInput = container.querySelector('.name');
							nameInput.value = key;
							nameInput.addEventListener('change', () =>
							{
								// TODO: save
							});

							const deleteButton = container.querySelector('.delete-btn');
							deleteButton.addEventListener('click', async () =>
							{
								if (await confirmDialog("Do you want to delete this directory and all its contents?"))
								{
									// TODO: delete & save
								}
							});

							const contents = container.querySelector('.contents');
							contents.append(...renderNode(node.directories[key]));
							list.push(container);
						}
					}

					if (node.items)
					{
						node.items.forEach(item =>
						{
							const container = document.createElement('div');
							container.classList.add('item');
							container.textContent = JSON.stringify(item); //TODO: show as text & code
							//TODO: delete button

							list.push(container);
						});
					}

					return list;
				};

				addEventListener('message', e => update(e.data));
			})();
		</script>
	</body>
	</html>
`;