<style>
	button {
		border: none;
		color: var(--vscode-editor-foreground);
		background: transparent;
		border-radius: 3px;
		padding: 3px 5px;
		cursor: pointer;
	}
	button:hover,
	button:focus {
		color: var(--vscode-textLink-activeForeground);
	}
	button > span {
		vertical-align: middle;
	}
	button > :global(svg) {
		display: inline-block;
		height: 1em;
		vertical-align: middle;
	}
</style>

<button type="button" {...$$props} on:click
		aria-label={$$props.title}>
	<span>+</span><slot/>
</button>