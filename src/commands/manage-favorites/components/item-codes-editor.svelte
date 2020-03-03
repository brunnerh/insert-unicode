<script>
	import IconButton from './icon-button.svelte';
	import { close } from '../icons';
	import { onMount } from 'svelte';
	import autoComplete from '@tarekraafat/autocomplete.js';

	export let data;
	export let codes;

	let addNewInput;
	let addNewAutoComplete;

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

	function encode(text)
	{
		// Good enough for non-external data
		return text
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}

	onMount(() =>
	{
		new autoComplete({
			data: {
				src: data.map(e => ({
					name: encode(`${String.fromCodePoint(e.codes[0])} - ${e.name} (0x${e.codes[0].toString(16)})`),
					codes: e.codes,
				})),
				key: ['name'],
				cache: true,
			},
			selector: () => addNewInput,
			resultsList: {
				render: true,
				container(source) {
					source.classList.add('auto-complete-list');
				},
				destination: addNewInput,
				position: 'afterend',
				element: 'ul'
			},
			maxResults: 100,
			highlight: true,
			trigger: {
				event: ["input", "focusin", "focusout"],
			},
			noResults()
			{
				const result = document.createElement("li");
				result.textContent = "No Results";
				addNewInput.nextElementSibling.appendChild(result);
			},
			onSelection(feedback)
			{
				if (feedback.selection == null)
					return;

				addNewInput.value = "";

				const entry = feedback.selection.value;
				codes = [...codes, entry.codes[0]];
			},
		});

		const resultsList = addNewInput.nextElementSibling;
		resultsList.style.display = 'none';
		['focus', 'blur'].forEach(eventType =>
		{
			addNewInput.addEventListener(eventType, () =>
			{
				switch (eventType)
				{
					case 'blur':
						resultsList.style.display = 'none';
						break;
					case 'focus':
						resultsList.style.display = 'block';
						break;
				}
			});
		});
	});
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
	}
	.add-new-container :global(.auto-complete-list) {
		top: 100%;
		position: absolute;
		min-width: 100%;
		max-height: 300px;
		box-sizing: border-box;
		background: var(--vscode-editor-background);
		border: 1px solid var(--vscode-editor-foreground);
		margin: 0;
		padding: 5px;
		list-style-type: none;
		overflow: auto;
		display: none;
	}
	.add-new-container :global(.auto-complete-list > li) {
		white-space: nowrap;
		cursor: pointer;
	}
	.add-new-container :global(.auto-complete-list .autoComplete_selected),
	.add-new-container :global(.auto-complete-list > li:hover) {
		background: var(--vscode-input-background);
	}
	.add-new-container :global(.auto-complete-list .autoComplete_highlighted) {
		font-weight: bold;
		color: var(--vscode-textLink-activeForeground);
	}
	.add-new-input {
		width: 100%;
		box-sizing: border-box;
	}
</style>

<div class="editor-list">
	{#each codes as code, i}
		<div>{String.fromCodePoint(code)}</div>
		<div>{getCodeName(data, code)}</div>
		<IconButton
			on:click={() => removeCodeAt(i)}>
			{@html close}
		</IconButton>
	{/each}

	<div class="add-new-container">
		<input bind:this={addNewInput} class="add-new-input"
			placeholder="Type to search, select to add..."/>
	</div>
</div>