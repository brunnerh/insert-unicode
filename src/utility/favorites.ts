import type { FavoritesNode } from "../config";

/** Merges directory trees. Does not eliminate duplicate items. */
export function merge(nodes: FavoritesNode[]): FavoritesNode
{
	const normalized = nodes.map(normalize);

	const directories: Record<string, FavoritesNode[]> = {};
	for (const node of normalized)
		for (let name in node.directories)
		{
			if (name in directories === false)
				directories[name] = [];

			directories[name].push(node.directories[name]);
		}

	return {
		directories: Object.fromEntries(
			Object.entries(directories).map(([name, subDirs]) => [
				name,
				merge(subDirs),
			])
		),
		items: normalized.flatMap(n => n.items),
	};
}

/**
 * Sets properties to empty objects if necessary.
 * @param node Node to normalize.
 */
export function normalize(node: FavoritesNode)
{
	if (node.directories === undefined)
		node.directories = {};
	if (node.items === undefined)
		node.items = [];

	return node as Required<FavoritesNode>;
}

/**
 * Checks whether a favorites node is empty.
 * @param node Node to check.
 * @param recursive
 *     Whether directories are checked recursively.
 *     If not an empty folder qualifies as not empty.
 */
export function empty(node: FavoritesNode, recursive = true)
{
	if (node.directories !== undefined &&
		(recursive ?
			Object.values(node.directories).some(d => empty(d, recursive) === false) :
			Object.keys(node.directories).length > 0)
		)
		return false;

	if (node.items !== undefined &&
		node.items.length > 0)
		return false;

	return true;
}