<script type="text/typescript">
	import { onMount } from 'svelte';
	import { codesToHex, codesToText } from '../../../utility/code-conversion';
	import { RevoGrid } from '@revolist/svelte-datagrid';
	import type * as revo  from '@revolist/revogrid/dist/types/interfaces';
	import { defineCustomElements } from '@revolist/revogrid/loader';
	import type { UnicodeEntry } from '../../../data';
	import { messageBus } from '../utility/message-bus';
	import { vscode } from '../../../svelte/utility/vscode-api';

	const columns = <revo.RevoGrid.ColumnRegular[]>[
		{
			prop: 'name',
			name: 'Name',
			columnType: 'text',
			size: 350,
			sortable: true,
			autoSize: true,
		},
		{
			prop: 'codes',
			name: 'Code',
			size: 200,
			cellTemplate: (c, props) => codesToHex(props.model[props.prop] ?? []),
			sortable: true,
			autoSize: true,
		},
		{
			prop: 'codes',
			name: 'Character',
			size: 200,
			cellTemplate: (c, props) => codesToText(props.model[props.prop] ?? []),
			autoSize: true,
		},
		{
			prop: 'aliases',
			name: 'Aliases',
			columnType: 'text',
			size: 500,
			sortable: true,
			autoSize: true,
		},
	];

	let theme = 'darkCompact';
	let searchText = '';

	let grid: RevoGrid;
	let data: Row[] | null = null;
	let gridLoaded = false;
	let error = false;

	let visibleRows: Row[] = [];

	$: if (grid != null)
	{
		// @ts-expect-error
		const gridInstance: HTMLElement = grid.getWebComponent();
		// @ts-expect-error
		gridInstance.addEventListener('beforesortingapply', onBeforeSortingApply);
		// @ts-expect-error
		gridInstance.addEventListener('beforesourcesortingapply', onBeforeSourceSortingApply);
	}

	let searchTimeout: number;
	$: if (data != null)
	{
		const entries = data;
		clearTimeout(searchTimeout);
		searchTimeout = window.setTimeout(() => visibleRows = search(entries, searchText), 300);
	}

	onMount(() =>
	{
		loadState();

		const updateTheme = () =>
			theme = document.body.classList.contains('vscode-light') ?
				'compact' : 'darkCompact';
		const themeObserver = new MutationObserver(updateTheme);

		themeObserver.observe(document.body, { attributes: true });
		updateTheme();

		const busToken = messageBus.subscribe(m =>
		{
			if (m.type == 'unicode-data')
				data = m.data.map(d => ({
					...d,
					aliases: d.aliases.join(', '),
				}));
		});

		messageBus.send({ type: 'get-unicode-data' });

		(async () =>
		{
			try
			{
				await defineCustomElements();
				gridLoaded = true;
			}
			catch
			{
				error = true;
			}
		})();

		return () =>
		{
			themeObserver.disconnect();
			busToken();
		};
	});

	function saveState()
	{
		vscode.setState({
			searchText
		} as State);
	}

	function loadState()
	{
		const state = vscode.getState<State | null>();
		if (state != null)
			searchText = state.searchText;
	}

	function search(entries: Row[], text: string)
	{
		const normalizedSearch = text.toLowerCase();

		return entries.filter(e =>
		{
			if (e.name.toLowerCase().indexOf(normalizedSearch) != -1)
				return true;

			if (codesToHex(e.codes).toLowerCase().indexOf(normalizedSearch) != -1)
				return true;

			if (codesToText(e.codes).toLowerCase().indexOf(normalizedSearch) != -1)
				return true;

			if (e.aliases.toLowerCase().indexOf(normalizedSearch) != -1)
				return true;

			return false;
		});
	}

	function onBeforeSortingApply(e: CustomEvent<{ column: revo.RevoGrid.ColumnRegular, order: 'desc' | 'asc' | undefined }>)
	{
		if (e.detail.column.name == 'Code')
		{
			e.preventDefault();
			visibleRows = [...visibleRows].sort((a, b) =>
			{
				const comparableIndices = Math.min(a.codes.length, b.codes.length);
				let totalDifference = 0;
				let multiplier = 1;
				for (let i = comparableIndices - 1; i >= 0; i--)
				{
					const difference = e.detail.order == 'asc' ?
						a.codes[i] - b.codes[i] :
						b.codes[i] - a.codes[i];

					totalDifference += difference * multiplier;
					multiplier *= 10;
				}

				return totalDifference;
			});
		}
	}
	function onBeforeSourceSortingApply(e: CustomEvent)
	{
		e.preventDefault();
	}

	type Row = Omit<UnicodeEntry, 'aliases'> & { aliases: string };

	interface State
	{
		searchText: string;
	}
</script>

<style>
	:global(html, body)
	{
		height: 100%;
		width: 100%;
		box-sizing: border-box;
	}
	:global(body)
	{
		display: flex;
		flex-direction: column;
	}

	.search
	{
		margin: 1em 0;
	}

	.table-container
	{
		flex: 1 1 auto;
	}

	.table-container :global(revogr-focus.focused-cell),
	.table-container :global(revogr-overlay-selection .selection-border-range)
	{
		display: none;
	}
</style>

{#if gridLoaded && data != null}
	<label class="search">
		Search
		<input type="search" bind:value={searchText} on:input={() => saveState()}/>
	</label>

	<div class="table-container">
		<RevoGrid bind:this={grid} source={visibleRows} {columns} {theme} readonly
			resize autoSizeColumn stretch={true} filter/>
	</div>
{/if}

{#if error}
	<p>Failed to load unicode data.</p>
{/if}
