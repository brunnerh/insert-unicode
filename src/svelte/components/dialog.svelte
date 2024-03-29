<script lang="ts">
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
	import Button, { ButtonKind } from './button.svelte';
	import * as uuid from 'uuid';

	/** Title of the dialog. */
	export let title: string | undefined = undefined;

	/** Content of the dialog. */
	export let content: any = undefined;

	/** Buttons of the dialog. */
	export let buttons: ButtonDefinition[] = [
		{ value: 'cancel', label: 'Cancel', kind: 'secondary' },
		{ value: 'ok', label: 'OK', kind: 'primary' },
	];

	/** Whether the dialog is modal. */
	export let isModal: boolean = true;

	/** Whether the dialog opens automatically. */
	export let autoOpen: boolean = true;

	let x = 0;
	let y = 0;

	const dispatch = createEventDispatcher();

	const id = 'I' + uuid.v4();
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
		document.body.appendChild(dialog);
		dialog.addEventListener('close', () => dispatch('closed'));

		if (autoOpen)
			open();
	});
</script>

<script lang="ts" context="module">
	export interface ButtonDefinition
	{
		value: string;
		label: string;
		kind: ButtonKind;
	}
</script>

<style>
	.dialog
	{
		color: var(--vscode-foreground);
		background: var(--vscode-notifications-background);
		padding: 1em;
		border: none;
		box-shadow: rgb(0, 0, 0) 0px 0px 8px;
		overflow: visible;
	}
	.dialog-buttons
	{
		margin-top: 1em;
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

<dialog bind:this={dialog}
		class="dialog"
		style="transform: translateX({x}px) translateY({y}px)"
		aria-labelledby={id + '_title'}>
	{#if title != null}
		<div class="dialog-title" id={id + '_title'}
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
			<Button on:click={() => buttonClick(button.value)} kind={button.kind}>
				{button.label}
			</Button>
		{/each}
	</div>
</dialog>
