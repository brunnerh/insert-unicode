import { FavoritesViewMessage } from "../favorites-view-message";
import { FavoritesBackEndMessage } from "../favorites-back-end-message";

class EventBus
{
	#vscode: { postMessage(data: any): void; };

	constructor()
	{
		// @ts-ignore
		this.#vscode = acquireVsCodeApi();
	}

	send(message: FavoritesViewMessage)
	{
		this.#vscode.postMessage(message);
	}

	listen(callback: (message: FavoritesBackEndMessage) => void)
	{
		// @ts-ignore
		addEventListener('message', e =>
		{
			const message = e.data;
			callback(message);
		});
	}
}

export const eventBus = new EventBus();