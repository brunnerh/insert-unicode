<script>
	import Item from './item.svelte';

	export let name;
	export let node;
</script>

<style>
	.directory > .contents
	{
		margin-left: 20px;
	}
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

<div class="directory">
	{#if name}
		<div class="header">
			<input class="name" bind:value={name}/>
			<button class="icon-btn delete-btn">X</button>
		</div>
	{/if}
	<div class="contents">
		{#if node.directories}
			{#each Object.keys(node.directories) as childName}
				<svelte:self
					name={childName}
					node={node.directories[childName]}/>
			{/each}
		{/if}
		{#if node.items}
			{#each node.items as codes}
				<Item {codes} />
			{/each}
		{/if}
	</div>
</div>