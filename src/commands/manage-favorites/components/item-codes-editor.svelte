<script lang="ts">
	import IconButton from '../../../svelte/components/icon-button.svelte';
	import { close } from '../icons';
	import { codesToHex } from '../../../utility/code-conversion';
	import type { UnicodeEntry } from '../../../data';
	import type { GetConfigValue } from '../favorites-view-message';
	import type { SendConfigValue } from '../favorites-back-end-message';
	import type { Await } from '../utility/types';
	import { messageBus } from '../utility/message-bus';
	import { AutoComplete } from '@brunnerh/autocomplete';

	export let data: UnicodeEntry[];
	export let codes: number[];

	let search = '';

	const enableAliasesPromise = messageBus.call<'config-value'>({
		type: 'get-config-value',
		config: 'enableAliases',
	} as GetConfigValue);

	$: autoCompleteItems = enableAliasesPromise.then(
		(enableAliases: SendConfigValue<'enableAliases'>) =>
		data.map(e =>
		{
			const item = {
				key: `${String.fromCodePoint(...e.codes)} - ${e.name} (${codesToHex(e.codes)})`,
				value: e.codes,
			};

			if (enableAliases.value && e.aliases.length > 0)
				item.key += ` [${e.aliases.join(', ')}]`;

			return item;
		})
	);

	function removeCodeAt(index: number)
	{
		const newItems = codes.slice();
		newItems.splice(index, 1);
		codes = newItems;
	}

	function getCodeName(data: UnicodeEntry[], code: number)
	{
		const match = data.filter(e => e.codes.length == 1 && e.codes[0] === code)[0];

		return match == undefined ? '?' : match.name;
	}

	function onItemSelected(item: Await<typeof autoCompleteItems>[number])
	{
		codes = [...codes, ...item.value];
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

	.combined-text {
		font-size: x-large;
	}

	.as-text {
		text-align: center;
	}

	.heading {
		font-weight: bold;
	}
	.span2 {
		grid-column: 1 / span 2;
	}
</style>

<div>
	<p>
		<span class="heading">Text:</span>
		<span class="combined-text">{String.fromCodePoint(...codes)}</span>
	</p>

	<div class="editor-list">
		<span class="heading span2">Characters:</span>
		<div>
			{#if codes.length > 0}
				<IconButton title="Remove all characters"
					on:click={() => codes = []}>
					{@html close}
				</IconButton>
			{/if}
		</div>

		{#each codes as code, i}
			<div class="as-text">{String.fromCodePoint(code)}</div>
			<div title={codesToHex([code])}>{getCodeName(data, code)}</div>
			<IconButton title="Remove character"
				on:click={() => removeCodeAt(i)}>
				{@html close}
			</IconButton>
		{/each}

		<div class="add-new-container">
			<AutoComplete
				placeholder="Type to search, select to add..."
				items={() => autoCompleteItems}
				maxItems={250}
				bind:search
				on:item-selected={e => onItemSelected(e.detail)}/>
		</div>
	</div>
</div>
