<style>
	button
	{
		background: var(--vscode-button-background);
		color: var(--vscode-button-foreground);
		border: none;
		max-width: fit-content;
		padding: 5px 10px;
		margin: 4px 5px;
	}
	button:hover
	{
		background: var(--vscode-button-hoverBackground);
	}
</style>

<button {...$$props} on:click>
	<slot/>
</button>