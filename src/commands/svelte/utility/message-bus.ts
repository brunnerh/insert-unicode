import { vscode } from './vscode-api';

export interface Message
{
	type: string;
}
export interface MessageInstance extends Message
{
	sequenceNumber: number;
}

export class MessageBus<
	BackEndMessage extends Message,
	ViewMessage extends Message,
>
{
	/** Placeholder for type information, avoiding additional generic parameter on class. */
	public _handler!: (m: BackEndMessage & MessageInstance) => void;

	private sequenceNumber = 0;
	private listeners = new Map<this['_handler'], any>();

	/**
	 * Sends a message to the back-end.
	 * @param message Message to send.
	 * @returns Sequence number of the message.
	 */
	send<T extends ViewMessage>(message: T)
	{
		const sequenceNumber = this.sequenceNumber++;
		const data: MessageInstance = { ...message, sequenceNumber };
		vscode.postMessage(data);

		return sequenceNumber;
	}

	/**
	 * Subscribes to back-end events.
	 * @param callback Event handler.
	 * @returns Function to unsubscribe again.
	 */
	subscribe(callback: this['_handler'])
	{
		const listener = (e: any) =>
		{
			const message = e.data;
			callback(message);
		};

		addEventListener('message', listener);

		this.listeners.set(callback, listener);

		return () => this.unsubscribe(callback);
	}

	/**
	 * Unsubscribes from back-end events.
	 * @param callback Previously subscribed event handler.
	 */
	unsubscribe(callback: this['_handler'])
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
	call<T extends BackEndMessage['type']>(message: ViewMessage)
		: Promise<FilterMessageByType<BackEndMessage, T>>
	{
		return new Promise(res =>
		{
			const number = this.send(message);
			const callback: this['_handler'] = m =>
			{
				if (m.sequenceNumber !== number)
					return;

				this.unsubscribe(callback);
				res(m as FilterMessageByType<BackEndMessage, T> & MessageInstance);
			};

			this.subscribe(callback);
		});
	}
}

export type FilterMessageByType<
	MessageBase extends { type: string },
	MessageType extends string
	> = MessageBase extends any ? MessageBase['type'] extends MessageType ? MessageBase : never : never;