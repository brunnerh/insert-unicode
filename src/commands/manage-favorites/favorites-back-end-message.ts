import type { FavoritesNode } from "../../config-interface";
import type { UnicodeEntry } from '../../data';

/** Message sent by the favorites manager back-end. */
export type FavoritesBackEndMessage =
	SendFavorites |
	SendUnicodeData;

export interface SendFavorites
{
	type: 'favorites';
	global: FavoritesNode | undefined;
	workspace: FavoritesNode | undefined;
}

export interface SendUnicodeData
{
	type: 'unicode-data';
	data: UnicodeEntry[];
}