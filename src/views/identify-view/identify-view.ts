import { CancellationToken, ConfigurationChangeEvent, TextEditorSelectionChangeEvent, Uri, Webview, WebviewView, WebviewViewProvider, WebviewViewResolveContext, window, workspace } from 'vscode';
import { identify } from '../../commands/identify-characters';
import { Config } from '../../config-interface';

export class IdentifyViewProvider implements WebviewViewProvider
{
	public static readonly viewType = 'insert-unicode.identifyView';

	private view?: WebviewView;

	constructor(private extensionUri: Uri)
	{
	}

	register()
	{
		return window.registerWebviewViewProvider(IdentifyViewProvider.viewType, this);
	}

	resolveWebviewView(
		webviewView: WebviewView,
		context: WebviewViewResolveContext<unknown>,
		token: CancellationToken
	): void | Thenable<void>
	{
		this.view = webviewView;
		const webview = this.view.webview;

		webview.options = {
			enableScripts: true,
			localResourceRoots: [this.extensionUri],
		};
		webview.html = this.html(webview);

		this.updatePanelFromCurrentEditor();

		const tokens = [
			webviewView.onDidChangeVisibility(() =>
			{
				if (webviewView.visible)
					this.updatePanelFromCurrentEditor();
			}),
			window.onDidChangeTextEditorSelection(e => this.selectionChanged(e)),
			workspace.onDidChangeConfiguration(e => this.configurationChanged(e)),
		];

		webviewView.onDidDispose(() => tokens.forEach(t => t.dispose()));
	}

	private html(webview: Webview)
	{
		const nonce = getNonce();

		return /*html*/`<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Identify Unicode Characters</title>
			</head>
			<body>
				<table id="table">
					<thead>
						<tr>
							<th>Character</th>
							<th>Name</th>
							<th>Code</th>
						</tr>
					</thead>
					<tbody>
					</tbody>
				</table>

				<script nonce="${nonce}">
					let delay = ${Config.section.get('identifyViewUpdateDelay')};
					let updateHandle = null;
					const tbody = document.querySelector('#table tbody');
					updateList([]);

					window.addEventListener('message', event =>
					{
						const message = event.data;
						switch (message.type)
						{
							case 'selection-changed':
								clearTimeout(updateHandle);
								updateHandle = setTimeout(() => updateList(message.items), delay);
								break;
							case 'delay-changed':
								delay = message.delay;
								break;
						}
					});

					function updateList(items)
					{
						tbody.innerHTML = '';

						if (items.length > 0)
						{
							items.forEach(item =>
							{
								const row = document.createElement('tr');
								const cell = text =>
								{
									const td = row.appendChild(document.createElement('td'));
									td.textContent = text;
								}

								cell(item.char);
								cell(
									item.entry === undefined ?
										'[Unknown character]' :
										item.entry.name
								);
								cell('0x' + item.code.toString(16));

								tbody.appendChild(row);
							});
						}
						else
						{
							const row = tbody.appendChild(document.createElement('tr'));
							const cell = row.appendChild(document.createElement('td'));
							cell.colSpan = 3;
							cell.textContent = 'Select text in the editor to identify its characters.';
						}
					}
				</script>
			</body>
			</html>
		`;
	}

	private selectionChanged(e: TextEditorSelectionChangeEvent)
	{
		if (this.view === undefined || this.view.visible === false)
			return;

		const selectionText = e.selections
			.flatMap(s => e.textEditor.document.getText(s))
			.join('');

		this.updatePanel(selectionText);
	}

	private configurationChanged(e: ConfigurationChangeEvent)
	{
		if (e.affectsConfiguration(`${Config.sectionName}.identifyViewUpdateDelay`))
			this.updateDelay();
	}

	/**
	 * If a text editor is active, the view is updated according to its selection.
	 */
	private updatePanelFromCurrentEditor()
	{
		const editor = window.activeTextEditor;
		if (editor === undefined)
			return;

		const selectionText = editor.selections
			.flatMap(s => editor.document.getText(s))
			.join('');

		this.updatePanel(selectionText);
	}

	/**
	 * Updates the view using the given selection text.
	 * @param selectionText The concatenated selection text.
	 */
	private updatePanel(selectionText: string)
	{
		if (this.view === undefined)
			return;

		const limit = Config.section.get('identifyViewCharacterLimit');

		this.view.webview.postMessage({
			type: 'selection-changed',
			items: identify(selectionText.substring(0, limit)),
		});
	}

	/**
	 * Updates the delay of the panel.
	 */
	private updateDelay()
	{
		if (this.view === undefined)
			return;

		this.view.webview.postMessage({
			type: 'delay-changed',
			delay: Config.section.get('identifyViewUpdateDelay'),
		});
	}
}


function getNonce()
{
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	return new Array(32).fill(0)
		.map(() => possible.charAt(Math.floor(Math.random() * possible.length)))
		.join('');
}