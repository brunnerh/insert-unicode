<script type="text/typescript">
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

	/** Title of the dialog. */
	export let title: string | undefined = undefined;

	/** Content of the dialog. */
	export let content: any = undefined;

	/** Buttons of the dialog. */
	export let buttons = [
		{ value: 'ok', label: 'OK' },
		{ value: 'cancel', label: 'Cancel' },
	];

	/** Whether the dialog is modal. */
	export let isModal: boolean = true;

	/** Whether the dialog opens automatically. */
	export let autoOpen: boolean = true;

	let x = 0;
	let y = 0;

	const dispatch = createEventDispatcher();

	let isOpen = false;

	let dialog: HTMLDialogElement;

	function buttonClick(type: string)
	{
		dispatch(type, null)
		dialog.close();
	}

	export function open()
	{
		if (isModal)
			dialog.showModal();
		else
			dialog.show();

		isOpen = true;
	}
	export function close()
	{
		dialog.close();

		isOpen = false;
	}

	let dragging = false;
	function onPointerDown(e: PointerEvent) {
		const target = e.currentTarget as HTMLElement;
		target.setPointerCapture(e.pointerId);
		dragging = true;
	}
	function onPointerUp(e: PointerEvent) {
		dragging = false;
		const target = e.currentTarget as HTMLElement;
		target.releasePointerCapture(e.pointerId);
	}
	function onPointerMove(e: PointerEvent) {
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