import { access } from 'fs/promises';

export async function exists(path: string): Promise<boolean>
{
	return access(path)
		.then(() => true)
		.catch(() => false);
}
