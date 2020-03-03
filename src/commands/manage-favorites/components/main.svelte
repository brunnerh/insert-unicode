<script>
	import Directory from './directory.svelte';
	import Button from './button.svelte';
	import { messageBus } from '../utility/message-bus.ts';
	import { fromSettings, toSettings, areFavoritesValid } from '../utility/favorites-transform.ts';
	import { showMessageDialog } from '../utility/dialog-utility.ts';
	import { asyncData } from '../utility/unicode-data.ts'; // Preload
	import { vscode } from '../utility/vscode-api.ts';
	import { onMount } from 'svelte';

	let favorites = null;
	let isDirty = false;

	onMount(async () =>
	{
		await loadState();
	});

	async function getFavorites()
	{
		const favoritesMessage = await messageBus.call('favorites', { type: 'get-favorites' });
		favorites = fromSettings(favoritesMessage.favorites);
		isDirty = false;
		saveState();
	}

	/** Save settings button. */
	async function save()
	{
		if (areFavoritesValid(favorites) == false)
		{
			await showMessageDialog('Multiple directories at the same level have the same name. Cannot save favorites.');
			return;
		}

		messageBus.send({ type: 'save', favorites: toSettings(favorites) });
		isDirty = false;
	}
	/** Revert settings button. */
	async function revert()
	{
		await getFavorites();
	}

	function onChange()
	{
		isDirty = true;
		messageBus.send({ type: 'changed' });
		saveState();
	}

	function saveState()
	{
		vscode.setState({
			isDirty,
			favorites,
		});
	}
	async function loadState()
	{
		const state = vscode.getState();
		if (state != null)
		{
			isDirty = state.isDirty;
			favorites = state.favorites;
		}
		else
		{
			await getFavorites();
		}
	}

	function onKeyDown(e)
	{
		if (e.ctrlKey === true &&
			e.altKey === false &&
			e.shiftKey === false &&
			e.metaKey === false &&
			e.key === 's')
		{
			save();
		}
	}
</script>

<style>
	.fav-tree {
		display: inline-grid;
		grid-template-columns: auto auto;
		grid-auto-rows: auto;
		grid-column-gap: 5px;
		grid-row-gap: 5px;
		align-items: center;
	}

	.button-bar {
		margin-top: 10px;
	}
</style>

<svelte:body on:keydown={onKeyDown}/>

<h1>Unicode Favorites</h1>

{#if favorites}
	<div class="fav-tree">
		<Directory node={favorites}
			on:change={onChange}/>
	</div>

	<div class="button-bar">
		<Button type="button" on:click={save}
			title="Saves the favorites to the settings.">
			Save
		</Button>
		<Button type="button" on:click={revert}
			title="Reloads the favorites from the settings.">
			Revert
		</Button>
	</div>
{/if}