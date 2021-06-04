import type { ExtensionContext } from 'vscode';

/**
 * Key constants for {@link ExtensionContext.globalState}.
 */
export const Keys = Object.freeze({
	lastVersion: 'last-version',
	recentlyUsed: 'recently-used',
});