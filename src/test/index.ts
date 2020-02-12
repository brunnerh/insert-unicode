import * as path from 'path';

import { runTests } from 'vscode-test';

async function go()
{
	const extensionDevelopmentPath = path.resolve(__dirname, '../../');
	const extensionTestsPath = path.resolve(__dirname, './index');
	const testWorkspace = path.resolve(__dirname, '..');

	await runTests({
		extensionDevelopmentPath,
		extensionTestsPath,
		launchArgs: [testWorkspace]
	});
}

go();