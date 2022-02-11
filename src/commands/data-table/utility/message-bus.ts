import type { DataTableViewMessage } from "../data-table-view-message";
import type { DataTableBackEndMessage } from "../data-table-back-end-message";
import { MessageBus } from '../../../svelte/utility/message-bus';

export const messageBus = new MessageBus<DataTableBackEndMessage, DataTableViewMessage>();
