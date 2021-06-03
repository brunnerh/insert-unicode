<script type="text/typescript">
	import Directory from './directory.svelte';
	import Button from '../../svelte/components/button.svelte';
	import { messageBus } from '../utility/message-bus';
	import { fromSettings, toSettings, areFavoritesValid, FavoritesViewSection } from '../utility/favorites-transform';
	import { showMessageDialog } from '../../svelte/utility/dialog-utility';
	import { vscode } from '../../svelte/utility/vscode-api';
	import { onMount } from 'svelte';
	import type { FavoritesSectionType } from '../favorites-section-type';

	import('../utility/unicode-data'); // Start async data loading

	let favoritesSections: FavoritesViewSection[] | null = null;
	let isDirty = false;

	onMount(async () =>
	{
		await loadState();
	});

	async function getFavorites()
	{
		const favoritesMessage = await messageBus.call<'favorites'>({ type: 'get-favorites' });
		favoritesSections = favoritesMessage.sections.map(section => ({
			type: section.type,
			favorites: fromSettings(section.favorites ?? {}),
		}));
		favoritesSections.forEach(s => s.favorites.isExpanded = true);

		isDirty = false;
		saveState();
	}

	/** Save settings button. */
	async function save()
	{
		if (favoritesSections == null ||
			favoritesSections.some(s => areFavoritesValid(s.favorites) == false))
		{
			await showMessageDialog('Multiple directories at the same level have the same name. Cannot save favorites.');
			return;
		}

		messageBus.send({
			type: 'save',
			sections: favoritesSections.map(s => ({
				type: s.type,
				favorites: toSettings(s.favorites),
			}))
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
			favoritesSections,
		} as State);
	}
	async function loadState()
	{
		const state = vscode.getState<State | null>();
		if (state != null)
		{
			isDirty = state.isDirty;
			favoritesSections = state.favoritesSections;
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

	const sectionLabels: Record<FavoritesSectionType, string> = {
		global: 'User Settings',
		workspace: 'Workspace Settings',
	}

	interface State
	{
		isDirty: boolean,
		favoritesSections: FavoritesViewSection[],
	}
</script>

<style>
	.fav-tree
	{
		display: inline-grid;
		grid-template-columns: auto auto;
		grid-auto-rows: auto;
		grid-column-gap: 5px;
		grid-row-gap: 5px;
		align-items: center;
	}

	.button-bar
	{
		margin-top: 1em;
	}
</style>

<svelte:body on:keydown={onKeyDown}/>

<h1>Unicode Favorites</h1>

{#if favoritesSections}
	{#each favoritesSections as section}
		<h2>{sectionLabels[section.type]}</h2>
		<div class="fav-tree">
			<Directory node={section.favorites}
				on:change={onChange}/>
		</div>
	{/each}

	<div class="button-bar">
		<Button type="button" on:click={revert} kind="secondary"
			title="Reloads the favorites from the settings.">
			Revert
		</Button>
		<Button type="button" on:click={save}
			title="Saves the favorites to the settings.">
			Save
		</Button>
	</div>
{/if}