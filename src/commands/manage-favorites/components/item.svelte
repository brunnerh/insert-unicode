<script type="text/typescript">
	import Dialog from '../../../svelte/components/dialog.svelte';
	import IconButton from '../../../svelte/components/icon-button.svelte';
	import ItemCodesEditor from './item-codes-editor.svelte';
	import { close } from '../icons';
	import { indentSize } from '../utility/constants';
	import { asyncData } from '../utility/unicode-data';
	import { createEventDispatcher } from 'svelte';
	import { codesToHex } from '../../../utility/code-conversion';
	import type { FavoritesItemView } from '../utility/favorites-transform';

	export let item: FavoritesItemView;
	export let indent = 0;

	let editDialog: Dialog;
	const dispatch = createEventDispatcher();

	function deleteItem()
	{
		dispatch('delete');
	}

	let editDialogCodes: number[] = [];

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
		<span class="code"
			title="{codesToHex(item.codes)}">
			{String.fromCodePoint(...item.codes)}
		</span>
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