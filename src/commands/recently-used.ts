import { RecentlyUsed } from '../utility/recently-used-list';
import { window } from 'vscode';

export const clearRecentlyUsed = () =>
{
	RecentlyUsed.clear();
	window.showInformationMessage('Recently used list cleared.');
};
