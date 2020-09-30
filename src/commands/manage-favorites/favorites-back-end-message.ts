import type { FavoritesNode } from "../../config-interface";
import type { UnicodeEntry } from '../../data';
import type { FavoritesSectionType } from "./favorites-section-type";

/** Message sent by the favorites manager back-end. */
export type FavoritesBackEndMessage =
	SendFavorites |
	SendUnicodeData;

export interface SendFavorites
{
	type: 'favorites';
	sections: SendFavoritesSection[];
}

export interface SendFavoritesSection
{
	type: FavoritesSectionType;
	favorites: FavoritesNode | undefined;
}

export interface SendUnicodeData
{
	type: 'unicode-data';
	data: UnicodeEntry[];
}