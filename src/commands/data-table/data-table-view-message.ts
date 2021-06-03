import type { Message } from "../svelte/utility/message-bus";

/** Message sent by the data table view. */
export type DataTableViewMessage =
	GetUnicodeData;

export interface GetUnicodeData extends Message
{
	type: 'get-unicode-data';
}
