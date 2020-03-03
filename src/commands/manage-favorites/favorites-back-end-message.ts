import { FavoritesNode } from "../../config-interface";
import { UnicodeEntry } from '../../data';

/** Message sent by the favorites manager back-end. */
export type FavoritesBackEndMessage =
	SendFavorites |
	SendUnicodeData;

export interface SendFavorites
{
	type: 'favorites';
	favorites: FavoritesNode;
}

export interface SendUnicodeData
{
	type: 'unicode-data';
	data: UnicodeEntry[];
}