/** Message sent by the favorites manager view. */
export type FavoritesViewMessage = GetFavorites;

interface GetFavorites
{
	type: 'get-favorites';
}
