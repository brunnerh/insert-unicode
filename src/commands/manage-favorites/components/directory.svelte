<script type="text/typescript">
	import Item from './item.svelte';
	import AddButton from './add-button.svelte';
	import IconButton from '../../../svelte/components/icon-button.svelte';
	import { folder, folderOpened, smiley, close } from '../icons';
	import { indentSize } from '../utility/constants';
	import { createEventDispatcher } from 'svelte';
	import type { FavoritesDirectoryView, FavoritesItemView, FavoritesViewNode } from '../utility/favorites-transform';

	const dispatch = createEventDispatcher();

	export let name: string | undefined = undefined;
	export let node: FavoritesViewNode;
	export let indent = -1;

	$: nameForTooltips = name == null
		? 'favorites root folder'
		: `"${name}"`;

	$: {
		node.directories.sort((a, b) =>
			a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
		);
	}

	function deleteDirectory()
	{
		dispatch('delete');
	}
	function deleteChildDirectory(childDirectory: FavoritesDirectoryView)
	{
		node.directories = node.directories.filter(d => d != childDirectory);
		dispatch('change');
	}
	function deleteChildItem(childItem: FavoritesItemView)
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
				content: { directories: [], items: [], isExpanded: true },
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

	function onBlur(e: Event)
	{
		const newName = (e.currentTarget as HTMLInputElement).value;
		if (newName == name)
			return;

		name = newName;
		dispatch('change')
	}
</script>

<style>
	.folder-label :global(svg) {
		vertical-align: text-bottom;
	}
	input.name
	{
		background: transparent;
		color: var(--vscode-editor-foreground);
	}
</style>

{#if name != null}
	<div class="folder-label"
		style="margin-left: {indent * indentSize}px">
		<IconButton on:click={() => node.isExpanded = !node.isExpanded}
			title={node.isExpanded ? "Collapse directory" : "Expand directory"}>
			{#if node.isExpanded}
				{@html folderOpened}
			{:else}
				{@html folder}
			{/if}
		</IconButton>
		<input class="name"
			value={name}
			placeholder="Unnamed Folder"
			on:blur={onBlur}/>
	</div>

	<IconButton
		title="Delete directory"
		on:click={deleteDirectory}>
		{@html close}
	</IconButton>
{/if}

{#if node.isExpanded}
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
{/if}