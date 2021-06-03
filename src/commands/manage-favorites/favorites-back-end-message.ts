import type { ConfigTypeMap, FavoritesNode } from "../../config";
import type { UnicodeEntry } from '../../data';
import type { FavoritesSectionType } from "./favorites-section-type";
import type { Message } from "../svelte/utility/message-bus";

/** Message sent by the favorites manager back-end. */
export type FavoritesBackEndMessage =
	SendFavorites |
	SendUnicodeData |
	SendConfigValue<any>;

export interface SendFavorites extends Partial<Message>
{
	type: 'favorites';
	sections: SendFavoritesSection[];
}

export interface SendFavoritesSection
{
	type: FavoritesSectionType;
	favorites: FavoritesNode | undefined;
}

export interface SendUnicodeData extends Partial<Message>
{
	type: 'unicode-data';
	data: UnicodeEntry[];
}

export interface SendConfigValue<T extends keyof ConfigTypeMap> extends Partial<Message>
{
	type: 'config-value';
	key: T;
	value: ConfigTypeMap[T];
}