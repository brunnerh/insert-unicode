<script>
	import Dialog from './dialog.svelte';
	import IconButton from './icon-button.svelte';
	import ItemCodesEditor from './item-codes-editor.svelte';
	import { close } from '../icons';
	import { indentSize } from '../utility/constants.ts';
	import { asyncData } from '../utility/unicode-data.ts';
	import { createEventDispatcher } from 'svelte';

	export let item;
	export let indent = 0;

	let editDialog;
	const dispatch = createEventDispatcher();

	function deleteItem()
	{
		dispatch('delete');
	}

	let editDialogCodes = [];

	function openEditDialog()
	{
		editDialogCodes = item.codes.slice();
		editDialog.open();
	}
	function saveEditedCodes()
	{
		item.codes = editDialogCodes;
		dispatch('change');
	}
</script>

<style>
	.item {
		color: var(--vscode-editor-foreground);
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
	}
	.code {
		background: var(--vscode-input-background);
		padding: 3px;
		border-radius: 3px;
		min-width: 1em;
		min-height: 1em;
		margin-right: 3px;
		text-align: center;
	}
</style>

<button type="button" class="item"
	style="margin-left: {indent * indentSize}px"
	on:click={openEditDialog}>
	{#if item.codes.length == 0}
		<span class="code">[Empty]</span>
	{:else}
		{#each item.codes as code}
			<span class="code"
				title="0x{code.toString(16)}">
				{String.fromCodePoint(code)}
			</span>
		{/each}
	{/if}
</button>

<div>
	<IconButton
		title="Delete favorite entry"
		on:click={deleteItem}>
		{@html close}
	</IconButton>
</div>

<Dialog bind:this={editDialog} autoOpen={false}
	title={"Edit Characters"}
	on:ok={saveEditedCodes}
	let:isOpen={editDialogOpen}>
	{#await asyncData}
		Loading...
	{:then data}
		{#if editDialogOpen}
			<ItemCodesEditor {data} bind:codes={editDialogCodes}/>
		{/if}
	{/await}
</Dialog>