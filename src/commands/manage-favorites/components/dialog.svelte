<script>
	/**
	 * Dialog Component
	 *
	 * Raises an event for the clicked button.
	 *
	 * Events: closed
	 * Additional events for default buttons: ok, cancel
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

	export let title = undefined;
	export let content = undefined;
	export let buttons = [
		{ value: 'ok', label: 'OK' },
		{ value: 'cancel', label: 'Cancel' },
	];
	export let isModal = true;
	export let autoOpen = true;

	const dispatch = createEventDispatcher();

	let isOpen = false;

	let dialog;
	function buttonClick(type)
	{
		dispatch(type, null)
		dialog.close();
	}

	function open()
	{
		if (isModal)
			dialog.showModal();
		else
			dialog.show();

		isOpen = true;
	}
	function close()
	{
		dialog.close();

		isOpen = false;
	}

	onMount(() =>
	{
		dialog.addEventListener('close', () => dispatch('closed'));

		if (autoOpen)
			open();
	});

	export {
		open,
		close,
	};
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
	.dialog-title
	{
		text-align: center;
		font-weight: bold;
		margin-bottom: 5px;
	}
</style>

<dialog class="dialog"
		bind:this={dialog}>
	{#if title != null}
		<div class="dialog-title">
			{title}
		</div>
	{/if}
	<div class="dialog-content">
		{#if content !== undefined}
			{content}
		{:else}
			<slot {isOpen} />
		{/if}
	</div>
	<div class="dialog-buttons">
		{#each buttons as button}
			<Button on:click={() => buttonClick(button.value)}>
				{button.label}
			</Button>
		{/each}
	</div>
</dialog>