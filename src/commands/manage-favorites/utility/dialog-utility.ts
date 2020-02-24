// @ts-ignore
import Dialog from '../components/dialog.svelte';

/**
 * Shows a confirmation dialog.
 * Resolves to `true` on OK and `false` on Cancel.
 * @param content The dialog text content.
 */
export async function showConfirmDialog(content: string): Promise<boolean>
{
	return new Promise((res) =>
	{
		const dialog = new Dialog({
			// @ts-ignore
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