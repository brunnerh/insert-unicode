import { Config } from '../config';
import { Context } from '../context';
import { Keys } from '../state';

const stateKey = Keys.recentlyUsed;

export class RecentlyUsed
{
	/**
	 * Clears the recently used list.
	 */
	static clear()
	{
		Context.current.globalState.update(stateKey, []);
	}

	/**
	 * Gets list of recently used characters by name.
	 * Empty if recently used list is disabled.
	 * The list is sorted from most recent to least recent.
	 * @returns List of recently used characters
	 */
	static get()
	{
		if (Config.section.get('enableRecentlyUsed') === false)
			return [];

		return Context.current.globalState.get<string[]>(stateKey, []);
	}

	/**
	 * Adds a character to the recently used list.
	 * Does nothing if the list is disabled.
	 * @param name The name of the character to add to the list.
	 */
	static addEntry(name: string)
	{
		if (Config.section.get('enableRecentlyUsed') === false)
			return;

		const list = Context.current.globalState.get<string[]>(stateKey, []);

		const newList = [name, ...list.filter(n => n !== name)]
			.slice(0, Config.section.get('recentlyUsedLimit'));

		Context.current.globalState.update(stateKey, newList);
	}
}