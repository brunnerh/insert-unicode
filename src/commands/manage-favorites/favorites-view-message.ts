import type { FavoritesNode } from "../../config-interface";

/** Message sent by the favorites manager view. */
export type FavoritesViewMessage =
	GetFavorites |
	GetUnicodeData |
	ChangeEvent |
	SaveEvent;

export interface GetFavorites
{
	type: 'get-favorites';
}

export interface GetUnicodeData
{
	type: 'get-unicode-data';
}

export interface ChangeEvent
{
	type: 'changed';
}

export interface SaveEvent
{
	type: 'save';
	global: FavoritesNode;
	workspace: FavoritesNode;
}