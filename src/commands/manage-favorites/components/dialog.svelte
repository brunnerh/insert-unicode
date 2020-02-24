<script>
	/**
	 * Dialog Component
	 *
	 * Events: ok, cancel, closed
	 *
	 * @example
	 *	const dialog = new Dialog({
	 *		target: document.body,
	 *		props: { content: 'Hi!' }
	 *	});
	 *
	 *	dialog.$on('ok', () =>
	 *	{
	 *		// ...
	 *	});
	 *	dialog.$on('cancel', () =>
	 *	{
	 *		// ...
	 *	});
	 *	dialog.$on('closed', () => dialog.$destroy());
	 */

	import { createEventDispatcher, onMount } from 'svelte';

	export let content;
	export let isModal = true;

	const dispatch = createEventDispatcher();

	let dialog;
	function buttonClick(type)
	{
		dispatch(type, null)
		dialog.close();
	}

	onMount(() =>
	{
		dialog.addEventListener('close', () => dispatch('closed', null));

		if (isModal)
			dialog.showModal();
		else
			dialog.show();
	});
</script>

<style>
	.dialog
	{
		color: var(--vscode-foreground);
		background: var(--vscode-notifications-background);
		padding: 10px;
		border: none;
		box-shadow: rgb(0, 0, 0) 0px 0px 8px;
	}
	.dialog-buttons
	{
		margin-top: 5px;
		text-align: right;
	}
	.dialog-buttons > button
	{
		background: var(--vscode-button-background);
		color: var(--vscode-button-foreground);
		border: none;
		max-width: fit-content;
		padding: 5px 10px;
		margin: 4px 5px;
	}
	.dialog-buttons > button:hover
	{
		background: var(--vscode-button-hoverBackground);
	}
</style>

<dialog class="dialog"
		bind:this={dialog}>
	<div class="dialog-content">{content}</div>
	<div class="dialog-buttons">
		<button type="button" on:click={() => buttonClick('ok')}>
			OK
		</button>
		<button type="button" on:click={() => buttonClick('cancel')}>
			Cancel
		</button>
	</div>
</dialog>