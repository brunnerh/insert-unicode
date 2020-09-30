<script type="text/typescript">
	import Directory from './directory.svelte';
	import Button from './button.svelte';
	import { messageBus } from '../utility/message-bus';
	import { fromSettings, toSettings, areFavoritesValid, FavoritesViewData } from '../utility/favorites-transform';
	import { showMessageDialog } from '../utility/dialog-utility';
	import { vscode } from '../utility/vscode-api';
	import { onMount } from 'svelte';

	import('../utility/unicode-data'); // Start async data loading

	let favorites: FavoritesViewData | null = null;
	let isDirty = false;

	onMount(async () =>
	{
		await loadState();
	});

	async function getFavorites()
	{
		const favoritesMessage = await messageBus.call('favorites', { type: 'get-favorites' });
		favorites = {
			global: fromSettings(favoritesMessage.global ?? {}),
			workspace: fromSettings(favoritesMessage.workspace ?? {}),
		};
		favorites.global.isExpanded = true;
		favorites.workspace.isExpanded = true;

		isDirty = false;
		saveState();
	}

	/** Save settings button. */
	async function save()
	{
		if (favorites == null ||
			areFavoritesValid(favorites.global) == false ||
			areFavoritesValid(favorites.workspace) == false)
		{
			await showMessageDialog('Multiple directories at the same level have the same name. Cannot save favorites.');
			return;
		}

		messageBus.send({
			type: 'save',
			global: toSettings(favorites.global),
			workspace: toSettings(favorites.workspace),
		});
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
		} as State);
	}
	async function loadState()
	{
		const state = vscode.getState<State | null>();
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

	function onKeyDown(e: KeyboardEvent)
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

	interface State
	{
		isDirty: boolean,
		favorites: FavoritesViewData,
	}
</script>

<style>
	h1 {
		font-size: 20px;
		padding-bottom: 3px;
		border-bottom: 1px solid;
	}

	h2 {
		font-size: 14px;
	}
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
	<h2>User Settings</h2>
	<div class="fav-tree">
		<Directory node={favorites.global}
			on:change={onChange}/>
	</div>

	<h2>Workspace Settings</h2>
	<div class="fav-tree">
		<Directory node={favorites.workspace}
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