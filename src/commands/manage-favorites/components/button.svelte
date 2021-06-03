<script type="text/typescript">
	export let kind: ButtonKind = 'primary';
</script>

<script type="text/typescript" context="module">
	export type ButtonKind = 'primary' | 'secondary';
</script>

<style>
	button
	{
		border: none;
		max-width: fit-content;
		min-width: 6em;
		padding: 5px 10px;
		margin: 4px 5px;
		cursor: pointer;
	}

	.primary
	{
		background: var(--vscode-button-background);
		color: var(--vscode-button-foreground);
	}
	.primary:hover, .primary:focus
	{
		background: var(--vscode-button-hoverBackground);
	}

	.secondary
	{
		background: var(--vscode-button-secondaryBackground);
		color: var(--vscode-button-secondaryForeground);
	}
	.secondary:hover, .secondary:focus
	{
		background: var(--vscode-button-secondaryHoverBackground);
	}
</style>

<button
	class:primary={kind == 'primary'}
	class:secondary={kind == 'secondary'}
	{...$$props} on:click>
	<slot/>
</button>