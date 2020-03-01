import { FavoritesNode } from "../../config-interface";

/** Message sent by the favorites manager view. */
export type FavoritesViewMessage =
	GetFavorites |
	ChangeEvent |
	SaveEvent;

interface GetFavorites
{
	type: 'get-favorites';
}

interface ChangeEvent
{
	type: 'changed';
}

interface SaveEvent
{
	type: 'save';
	favorites: FavoritesNode;
}