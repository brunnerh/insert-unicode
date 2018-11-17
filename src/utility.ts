import * as vscode from "vscode";
import { QuickPickItem, QuickPickOptions, CancellationToken } from "vscode";

export async function showPaginatedQuickPick<T extends QuickPickItem>(
	items: T[] | Thenable<T[]>,
	options: QuickPickOptions & { pageSize?: number },
	token?: CancellationToken): Promise<T | undefined>
{
	const resolvedItems = await items;

	const defaults = { pageSize: 100 };
	options = { ...defaults, ...options };

	type ActionItem = QuickPickItem & { _callback: () => Promise<T | undefined> };

	const showPage = async (page: number) =>
	{
		const pageSize = options.pageSize!;
		const pageItems = <(T | ActionItem)[]>resolvedItems.slice(page * pageSize, (page + 1) * pageSize);

		const resultsString = (offset: number) =>
		{
			const start = (page + offset) * pageSize + 1;
			const end = Math.min((page + 1 + offset) * pageSize, resolvedItems.length);

			return `Results ${start} - ${end} of ${resolvedItems.length}`;
		};
		const previousPageItem = <ActionItem>{
			label: "[Previous Page]",
			description: resultsString(-1),
			_callback: () => showPage(page - 1)
		};
		const nextPageItem = <ActionItem>{
			label: "[Next Page]",
			description: resultsString(+1),
			_callback: () => showPage(page + 1)
		};

		if (page > 0)
			pageItems.unshift(previousPageItem);
		if ((page + 1) * pageSize < resolvedItems.length)
			pageItems.push(nextPageItem);

		const selection = await vscode.window.showQuickPick(pageItems, options, token);

		// Paging item selected
		if (selection && '_callback' in selection)
			return await selection._callback();

		else return selection;
	};

	return await showPage(0);
}
