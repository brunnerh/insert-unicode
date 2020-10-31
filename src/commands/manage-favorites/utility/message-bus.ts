import type { FavoritesViewMessage } from "../favorites-view-message";
import type { FavoritesBackEndMessage } from "../favorites-back-end-message";
import { vscode } from './vscode-api';

type BackEndEventHandler = (message: FavoritesBackEndMessage) => void;

export interface Message
{
	sequenceNumber: number;
}

class MessageBus
{
	private sequenceNumber = 0;
	private listeners = new Map<BackEndEventHandler, any>();

	/**
	 * Sends a message to the back-end.
	 * @param message Message to send.
	 * @returns Sequence number of the message.
	 */
	send<T extends Omit<FavoritesViewMessage, 'sequenceNumber'>>(message: T)
	{
		const sequenceNumber = this.sequenceNumber++;
		const data = { ...message, sequenceNumber } as FavoritesViewMessage;
		vscode.postMessage(data);

		return sequenceNumber;
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

		this.listeners.set(callback, listener);
	}

	/**
	 * Unsubscribes from back-end events.
	 * @param callback Previously subscribed event handler.
	 */
	unsubscribe(callback: BackEndEventHandler)
	{
		const listener = this.listeners.get(callback);
		removeEventListener('message', listener);
		this.listeners.delete(callback);
	}

	/**
	 * Sends a message and waits for a matching response.
	 * @param responseType The type of the expected response message.
	 * @param message The message to send to the back-end.
	 */
	call<T extends FavoritesBackEndMessage['type']>(
		message: Omit<FavoritesViewMessage, 'sequenceNumber'>
	) : Promise<FilterMessageByType<FavoritesBackEndMessage, T>>
	{
		return new Promise(res =>
		{
			const number = this.send(message);
			const callback: BackEndEventHandler = m =>
			{
				if (m.sequenceNumber !== number)
					return;

				this.unsubscribe(callback);
				res(m as FilterMessageByType<FavoritesBackEndMessage, T>);
			};

			this.subscribe(callback);
		});
	}
}

export const messageBus = new MessageBus();

export type FilterMessageByType<
	MessageBase extends { type: string },
	MessageType extends string
	> = MessageBase extends any ? MessageBase['type'] extends MessageType ? MessageBase : never : never;