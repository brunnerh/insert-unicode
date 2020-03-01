// @ts-ignore
import Dialog from '../components/dialog.svelte';

/**
 * Shows a confirmation dialog.
 * Resolves to `true` on OK and `false` on Cancel.
 * @param content The dialog text content.
 */
export async function showConfirmDialog(content: string): Promise<boolean>
{
	return new Promise(res =>
	{
		const dialog = new Dialog({
			target: document.body,
			props: { content },
		});

		let confirmed = false;

		dialog.$on('ok', () => confirmed = true);
		dialog.$on('cancel', () => confirmed = false);
		dialog.$on('closed', () =>
		{
			res(confirmed);
			dialog.$destroy();
		});
	});
}

/**
 * Shows a message dialog.
 * @param content The dialog text content.
 */
export async function showMessageDialog(content: string): Promise<void>
{
	return new Promise(res =>
	{
		const dialog = new Dialog({
			target: document.body,
			props: {
				content,
				buttons: [{ value: 'ok', label: 'OK' }],
			},
		});

		dialog.$on('closed', () =>
		{
			res();
			dialog.$destroy();
		});
	});
}