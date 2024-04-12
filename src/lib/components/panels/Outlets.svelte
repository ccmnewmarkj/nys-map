<script>
	// Import stores
	import { directoryData, filteredDirectory } from '$lib/stores.js';
</script>

<p><strong>List of outlets</strong></p>
{#each $filteredDirectory?.features as outlet}
	<p>{outlet.properties['Media Outlet']}</p>
{/each}
