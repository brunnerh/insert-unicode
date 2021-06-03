import type { UnicodeEntry } from '../../data';
import type { Message } from "../svelte/utility/message-bus";

/** Message sent by the data table back-end. */
export type DataTableBackEndMessage =
	SendUnicodeData;

export interface SendUnicodeData extends Partial<Message>
{
	type: 'unicode-data';
	data: UnicodeEntry[];
}
