import type { FavoritesNode } from "../../../config";
import type { FavoritesSectionType } from "../favorites-section-type";

export interface FavoritesViewSection
{
	type: FavoritesSectionType;
	favorites: FavoritesViewNode;
}

export interface FavoritesViewNode
{
	directories: FavoritesDirectoryView[];

	items: FavoritesItemView[];

	isExpanded: boolean;
}
export interface FavoritesDirectoryView
{
	name: string;

	content: FavoritesViewNode;
}
export interface FavoritesItemView
{
	codes: number[];
}

/**
 * Transforms a favorites setting into a normalized and
 * more easily manipulated data structure.
 * @param node The settings data.
 */
export function fromSettings(node: FavoritesNode): FavoritesViewNode
{
	return {
		directories: node.directories
			? Object.entries(node.directories)
				.map(([name, value]) =>
					({
						name,
						content: fromSettings(value),
					}))
			: [],
		items: node.items
			? node.items.map(codes =>
				({
					codes: codes.map(c => typeof c === 'string' ? parseInt(c) : c),
				}))
			: [],
		isExpanded: false,
	};
}

/**
 * Transforms a settings view model to the settings structure.
 * @param node The settings view model.
 */
export function toSettings(node: FavoritesViewNode): FavoritesNode
{
	return {
		directories: Object.fromEntries(node.directories.map(d =>
			[
				d.name,
				toSettings(d.content),
			])),
		items: node.items.map(i => i.codes),
	};
}

/**
 * Checks whether favorites view model is valid
 * (i.e. can be converted back to the settings format).
 * @param node Favorites view model.
 */
export function areFavoritesValid(node: FavoritesViewNode): boolean
{
	const names = node.directories.map(d => d.name);
	const locallyValid = names.length === new Set(names).size;
	const recursivelyValid = node
		.directories
		.map(d => areFavoritesValid(d.content))
		.every(x => x);

	return locallyValid && recursivelyValid;
}