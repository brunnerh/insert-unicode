<script>
	import Item from './item.svelte';
	import AddButton from './add-button.svelte';
	import IconButton from './icon-button.svelte';
	import Dialog from './dialog.svelte';
	import { folder, smiley, close } from '../icons';
	import { indentSize } from '../utility/constants.ts';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let name;
	export let node;
	export let indent = -1;

	$: nameForTooltips = name == null
		? 'favorites root folder'
		: `"${name}"`;

	function deleteDirectory()
	{
		dispatch('delete');
	}
	function deleteChildDirectory(childDirectory)
	{
		node.directories = node.directories.filter(d => d != childDirectory);
		dispatch('change');
	}
	function deleteChildItem(childItem)
	{
		node.items = node.items.filter(i => i != childItem);
		dispatch('change');
	}

	function addFolder()
	{
		node.directories = [
			...node.directories,
			{
				name: 'New Folder',
				content: { directories: [], items: [] },
			},
		];
		dispatch('change');
	}
	function addItem()
	{
		node.items = [
			...node.items,
			{ codes: [] },
		];
		dispatch('change');
	}
</script>

<style>
	input.name
	{
		background: transparent;
		color: var(--vscode-editor-foreground);
	}
</style>

{#if name}
	<input class="name" style="margin-left: {indent * indentSize}px"
		bind:value={name}
		on:input={() => dispatch('change')}/>

	<IconButton
		title="Delete directory"
		on:click={deleteDirectory}>
		{@html close}
	</IconButton>
{/if}

{#each node.directories as childDirectory}
	<svelte:self
		bind:name={childDirectory.name}
		node={childDirectory.content}
		indent={indent + 1}
		on:delete={() => deleteChildDirectory(childDirectory)}
		on:change/>
{/each}

{#each node.items as item}
	<Item
		{item}
		indent={indent + 1}
		on:delete={() => deleteChildItem(item)}
		on:change/>
{/each}



<div style="margin-left: {(indent + 1) * indentSize}px">
	<AddButton on:click={addFolder} title="Add new folder to {nameForTooltips}">
		{@html folder}
	</AddButton>

	<AddButton on:click={addItem} title="Add new favorite entry to {nameForTooltips}">
		{@html smiley}
	</AddButton>
</div>
<div></div>