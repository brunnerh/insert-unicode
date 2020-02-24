<script>
	export let codes;
</script>

<style>
</style>

<div class="item">
	<!-- TODO: show as text & code -->
	{#each codes as code}
		<span>{code}</span>
	{/each}

	<!-- TODO: delete button -->
</div>