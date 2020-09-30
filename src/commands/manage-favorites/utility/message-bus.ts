import type { FavoritesViewMessage } from "../favorites-view-message";
import type { FavoritesBackEndMessage } from "../favorites-back-end-message";
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
			// console.log(`Received message '${message.type}'`, message);
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
	call<T extends FavoritesBackEndMessage['type']>(
		responseType: T,
		message: FavoritesViewMessage
	) : Promise<FilterMessageByType<FavoritesBackEndMessage, T>>
	{
		return new Promise(res =>
		{
			const callback: BackEndEventHandler = m =>
			{
				if (m.type !== responseType)
					return;

				this.unsubscribe(callback);
				res(m as FilterMessageByType<FavoritesBackEndMessage, T>);
			};

			this.subscribe(callback);
			this.send(message);
		});
	}
}

export const messageBus = new MessageBus();


export type FilterMessageByType<
	MessageBase extends { type: string },
	MessageType extends string
	> = MessageBase extends any ? MessageBase['type'] extends MessageType ? MessageBase : never : never;