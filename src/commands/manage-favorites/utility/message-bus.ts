import { FavoritesViewMessage } from "../favorites-view-message";
import { FavoritesBackEndMessage } from "../favorites-back-end-message";
import { vscode } from './vscode-api';

type BackEndEventHandler = (message: FavoritesBackEndMessage) => void;

class MessageBus
{
	private _listeners = new Map<BackEndEventHandler, any>();

	/**
	 * Sends a message to the back-end.
	 * @param message Message to send.
	 */
	send(message: FavoritesViewMessage)
	{
		vscode.postMessage(message);
	}

	/**
	 * Subscribes to back-end events.
	 * @param callback Event handler.
	 */
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

	/**
	 * Unsubscribes from back-end events.
	 * @param callback Previously subscribed event handler.
	 */
	unsubscribe(callback: BackEndEventHandler)
	{
		const listener = this._listeners.get(callback);
		removeEventListener('message', listener);
		this._listeners.delete(callback);
	}

	/**
	 * Sends a message and waits for a response matching `responseType`.
	 * @param responseType The type of the expected response message.
	 * @param message The message to send to the back-end.
	 */
	call(responseType: FavoritesBackEndMessage['type'], message: FavoritesViewMessage)
		: Promise<FavoritesBackEndMessage>
	{
		return new Promise(res =>
		{
			this.subscribe(m =>
			{
				if (m.type === responseType)
					res(m);
			});

			this.send(message);
		});
	}
}

export const messageBus = new MessageBus();