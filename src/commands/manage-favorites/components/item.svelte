<script>
	import { createEventDispatcher } from 'svelte';

	export let item;
	export let indent = 0;

	const dispatch = createEventDispatcher();

	function deleteItem()
	{
		dispatch('delete');
	}
</script>

<style>
</style>

<div class="item"
	style="margin-left: {indent * 20}px">
	<!-- TODO: show as text & code -->
	{#each item.codes as code}
		<span>{code}</span>
	{/each}
</div>

<div>
	<button type="button" class="icon-btn"
		title="Delete favorite entry"
		on:click={deleteItem}>
		X
	</button>
</div>