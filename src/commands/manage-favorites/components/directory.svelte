<script>
	import Item from './item.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let name;
	export let node;
	export let indent = -1;

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
</script>

<style>
	.name
	{
		background: var(--vscode-editor-background);
		color: var(--vscode-editor-foreground);
		border: 1px solid transparent;
		transition: border ease-in-out 0.3s;
	}
	.name:hover,
	.name:focus
	{
		border: 1px solid var(--vscode-editor-foreground);
	}
</style>

{#if name}
	<input class="name" style="margin-left: {indent * 20}px"
		bind:value={name}
		on:input={() => dispatch('change')}/>

	<button type="button" class="icon-btn"
		title="Delete directory"
		on:click={deleteDirectory}>
		X
	</button>
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
		on:delete={() => deleteChildItem(item)}/>
{/each}