<style>
	button
	{
		text-align: center;
		background: transparent;
		color: var(--vscode-foreground);
		border: 1px solid transparent;
		padding: 3px;
		cursor: pointer;
	}
	button:hover,
	button:focus
	{
		color: var(--vscode-textLink-activeForeground);
	}
	button > :global(svg)
	{
		display: inline-block;
		vertical-align: middle;
	}
</style>

<button type="button" {...$$props} on:click>
	<slot />
</button>