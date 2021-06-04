import { window, env, MessageItem, Uri } from 'vscode';
import { Context } from '../context';

/**
 *
 * @param message The messsage of the error.
 * @param issueData Information to show in the issue.
 * @param otherItems Other buttons to show.
 * @returns `null` if no selection was made or the issue link was selected.
 */
export async function showIssueError<T extends MessageItem>(
	message: string, issueData: IssueData, ...otherItems: T[]
)
{
	const issueItem = <MessageItem>{ title: 'Open Issue' };
	const items = [...otherItems, issueItem];

	const selection = await window.showErrorMessage(message, ...items);
	if (selection === issueItem)
	{
		let errorInfo: string | null = null;
		try { errorInfo = JSON.stringify(issueData.errorInfo, undefined, '  '); }
		catch { }

		// https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-issues/about-automation-for-issues-and-pull-requests-with-query-parameters

		const url = new URL(Context.current.extension.packageJSON.homepage + '/issues/new');
		url.searchParams.set('title', issueData.title ?? '');
		url.searchParams.set('body', errorInfo === null ? '' : [
			'<!-- Please review the error information and remove anything sensitive. -->',
			'',
			'<details>',
			'<summary>Error Info</summary>',
			'',
			'```json',
			errorInfo,
			'```',
			'</details>'
		].join('\n'));

		env.openExternal(Uri.parse(url.toString()));

		return null;
	}

	return selection as T | null;
}

/**
 * Makes an error JSON serializable.
 * @param error The error.
 * @returns The error.
 */
export function makeErrorSerializable(error: any)
{
	Object.defineProperty(error, 'toJSON', {
		value()
		{
			const self = this;
			const record: Record<string, any> = {};

			Object.getOwnPropertyNames(self)
				.forEach(key => record[key] = self[key]);

			if (error instanceof Error)
			{
				if ('stack' in record && record.stack != null)
					record.stack = record.stack.split('\n');
			}

			return record;
		},
		configurable: true,
		writable: true
	});

	return error;
}

export interface IssueData
{
	/**
	 * Error/error information that is attached to the issue.
	 * {@link makeErrorSerializable} should be used on error instances.
	 */
	errorInfo: any;

	/** The title of the new Github issue. */
	title?: string;
}