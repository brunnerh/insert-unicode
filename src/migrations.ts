import { window } from 'vscode';
import { makeErrorSerializable, showIssueError } from './utility/messages';

/**
 * Executes automatic migrations or shows migration instructions to the user.
 * @param previousVersion The previously used version of the extension.
 * @param currentVersion The currently used version of the extension.
 */
export async function migrate(previousVersion: string | undefined, currentVersion: string)
{
	try
	{
		// const previous = parseVersion(previousVersion);
		// const current = parseVersion(currentVersion);
		// ...
	}
	catch (error)
	{
		showIssueError(
			'Failed to migrate extension version.',
			{
				errorInfo: {
					previousVersion,
					currentVersion,
					error: makeErrorSerializable(error),
				},
				title: 'Migration Error',
			},
			{ title: 'Close' },
		);
	}
}

function parseVersion<T extends string | undefined>(versionString: T):
	T extends string ? Version : undefined
{
	if (versionString === undefined)
		return undefined as any;

	const parts = versionString.split('.');

	return {
		major: +parts[0],
		minor: +parts[1],
		patch: +parts[2],
	} as Version as any;
}

interface Version
{
	major: number;
	minor: number;
	patch: number;
}