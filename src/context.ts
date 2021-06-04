import { ExtensionContext } from 'vscode';

/**
 * Singleton for the extension context.
 */
export class Context
{
	private static _current: ExtensionContext;

	/** The current context. */
	static get current() { return this._current; }


	/**
	 * Sets the context.
	 * @param context The context to set.
	 */
	public static set(context: ExtensionContext)
	{
		this._current = context;
	}
}