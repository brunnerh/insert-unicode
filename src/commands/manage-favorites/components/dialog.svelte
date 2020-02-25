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
	import Button from './button.svelte';

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
</style>

<dialog class="dialog"
		bind:this={dialog}>
	<div class="dialog-content">{content}</div>
	<div class="dialog-buttons">
		<Button on:click={() => buttonClick('ok')}>
			OK
		</Button>
		<Button on:click={() => buttonClick('cancel')}>
			Cancel
		</Button>
	</div>
</dialog>