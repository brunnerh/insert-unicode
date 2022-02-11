import type { FavoritesViewMessage } from "../favorites-view-message";
import type { FavoritesBackEndMessage } from "../favorites-back-end-message";
import { MessageBus } from '../../../svelte/utility/message-bus';

export const messageBus = new MessageBus<FavoritesBackEndMessage, FavoritesViewMessage>();
