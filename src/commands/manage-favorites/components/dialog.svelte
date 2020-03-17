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

	let x = 0;
	let y = 0;

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

	let dragging = false;
	function onPointerDown(e) {
		e.currentTarget.setPointerCapture(e.pointerId);
		dragging = true;
	}
	function onPointerUp(e) {
		dragging = false;
		e.currentTarget.releasePointerCapture(e.pointerId);
	}
	function onPointerMove(e) {
		if (dragging == false)
			return;

		x += e.movementX;
		y += e.movementY;
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
		padding-bottom: 5px;
		user-select: none;
	}
</style>

<dialog class="dialog"
		bind:this={dialog}
		style="transform: translateX({x}px) translateY({y}px)">
	{#if title != null}
		<div class="dialog-title"
			on:pointerdown={onPointerDown}
			on:pointerup={onPointerUp}
			on:pointermove={onPointerMove}>
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