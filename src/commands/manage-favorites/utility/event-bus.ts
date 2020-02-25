import { FavoritesViewMessage } from "../favorites-view-message";
import { FavoritesBackEndMessage } from "../favorites-back-end-message";

type BackEndEventHandler = (message: FavoritesBackEndMessage) => void;

class EventBus
{
	private _listeners = new Map<BackEndEventHandler, any>();

	#vscode: { postMessage(data: any): void };

	constructor()
	{
		// @ts-ignore
		this.#vscode = acquireVsCodeApi();
	}

	send(message: FavoritesViewMessage)
	{
		this.#vscode.postMessage(message);
	}

	subscribe(callback: BackEndEventHandler)
	{
		const listener = (e: any) =>
		{
			const message = e.data;
			callback(message);
		};

		addEventListener('message', listener);

		this._listeners.set(callback, listener);
	}

	unsubscribe(callback: BackEndEventHandler)
	{
		const listener = this._listeners.get(callback);
		removeEventListener('message', listener);
		this._listeners.delete(callback);
	}
}

export const eventBus = new EventBus();