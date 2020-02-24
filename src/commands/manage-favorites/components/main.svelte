<script>
	import Directory from './directory.svelte';
	import Dialog from './dialog.svelte';
	import { eventBus } from '../utility/event-bus.ts';
	import { showConfirmDialog } from '../utility/dialog-utility.ts';
	import { onMount } from 'svelte';

	let favorites = null;

	onMount(() =>
	{
		eventBus.listen(m =>
		{
			switch (m.type)
			{
				case 'favorites':
					favorites = m.favorites;
					break;
			}
		})
		eventBus.send({ type: 'get-favorites' });
	});

	async function save()
	{
		// TODO
	}
	async function revert()
	{
		// TODO
	}
</script>

<style>
	:global(.icon-btn)
	{
		font-weight: bold;
		background: transparent;
		color: var(--vscode-foreground);
		border: 1px solid transparent;
		transition: border ease-in-out 0.3s;
	}
	:global(.icon-btn:hover),
	:global(.icon-btn:focus)
	{
		border: 1px solid var(--vscode-foreground);
	}

	.button-bar {
		margin-top: 10px;
	}
</style>

<h1>Favorites</h1>

{#if favorites}
	<Directory node={favorites}/>
{:else}
	Loading...
{/if}

<div class="button-bar">
	<button type="button" on:click={save}>Save</button>
	<button type="button" on:click={revert}>Revert</button>
</div>