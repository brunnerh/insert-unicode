<script>
	import IconButton from './icon-button.svelte';
	import { close } from '../icons';
	import { AutoComplete } from '@brunnerh/autocomplete';

	export let data;
	export let codes;

	let search = '';

	$: autoCompleteItems = data.map(e => ({
			key: `${String.fromCodePoint(e.codes[0])} - ${e.name} (0x${e.codes[0].toString(16)})`,
			value: e.codes[0],
		}));

	function removeCodeAt(index)
	{
		const newItems = codes.slice();
		newItems.splice(index, 1);
		codes = newItems;
	}
	function getCodeName(data, code)
	{
		const match = data.filter(e => e.codes[0] === code)[0];

		return match == undefined ? '?' : match.name;
	}

	function onItemSelected(code) {
		codes[codes.length] = code.value;
		search = '';
	}
</script>

<style>
	.editor-list {
		display: inline-grid;
		grid-row-gap: 5px;
		grid-column-gap: 3px;
		grid-template-columns: max-content 1fr max-content;
		grid-auto-rows: auto;
		align-items: center;
		min-width: 30ch;
	}
	.editor-list > div {
		vertical-align: middle;
	}

	.add-new-container {
		grid-column: 1 / span 3;
		position: relative;
		min-width: 350px;

		--ac-input-color: var(--vscode-input-foreground);
		--ac-input-background: var(--vscode-input-background);
		--ac-input-border: none;
		--ac-input-padding: 3px;
		--ac-input-margin: 0;

		--ac-dropdown-background: var(--vscode-editor-background);
		--ac-dropdown-border: 1px solid var(--vscode-input-foreground);
		--ac-result-border: 1px solid transparent;
		--ac-result-match-color: var(--vscode-textLink-activeForeground);
		--ac-result-highlighted-background: var(--vscode-input-background);
		--ac-result-highlighted-border: 1px solid var(--vscode-input-foreground);
	}

	.as-text {
		text-align: center;
	}
</style>

<div class="editor-list">
	{#each codes as code, i}
		<div class="as-text">{String.fromCodePoint(code)}</div>
		<div>{getCodeName(data, code)}</div>
		<IconButton
			on:click={() => removeCodeAt(i)}>
			{@html close}
		</IconButton>
	{/each}

	<div class="add-new-container">
		<AutoComplete
			placeholder="Type to search, select to add..."
			items={() => autoCompleteItems}
			maxItems={100}
			bind:search
			on:item-selected={e => onItemSelected(e.detail)}/>
	</div>
</div>