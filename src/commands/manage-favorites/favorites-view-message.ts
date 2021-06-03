import type { ConfigTypeMap, FavoritesNode } from "../../config";
import type { FavoritesSectionType } from "./favorites-section-type";
import type { Message } from "../svelte/utility/message-bus";

/** Message sent by the favorites manager view. */
export type FavoritesViewMessage =
	GetFavorites |
	GetUnicodeData |
	GetConfigValue |
	ChangeEvent |
	SaveEvent;

export interface GetFavorites extends Message
{
	type: 'get-favorites';
}

export interface GetUnicodeData extends Message
{
	type: 'get-unicode-data';
}

export interface GetConfigValue extends Message
{
	type: 'get-config-value';
	config: keyof ConfigTypeMap;
}

export interface ChangeEvent extends Message
{
	type: 'changed';
}

export interface SaveEvent extends Message
{
	type: 'save';
	sections: SaveEventSection[];
}

export interface SaveEventSection
{
	type: FavoritesSectionType;
	favorites: FavoritesNode;
}