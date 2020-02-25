<script>
	import Directory from './directory.svelte';
	import Button from './button.svelte';
	import { eventBus } from '../utility/event-bus.ts';
	import { onMount } from 'svelte';

	let favorites = null;

	onMount(() =>
	{
		eventBus.subscribe(m =>
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

	<div class="button-bar">
		<Button type="button" on:click={save}>Save</Button>
		<Button type="button" on:click={revert}>Revert</Button>
	</div>
{:else}
	Loading...
{/if}