import { FavoritesNode } from "../../config-interface";

/** Message sent by the favorites manager back-end. */
export type FavoritesBackEndMessage = SendFavorites;

interface SendFavorites
{
	type: 'favorites';
	favorites: FavoritesNode;
}
