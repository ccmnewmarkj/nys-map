<script>
	// Import components
	import Map from '$lib/components/Map.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	// Import icon components
	import ListIcon from '$lib/components/icons/List.svelte';

	// Import transition
	import { fade } from 'svelte/transition';

	// Set state of sidebar
	let sidebarVisible = true;

	// Import directory data
	export let data; // Airtable directory data
	import { directoryData } from '$lib/stores.js';

	import { onMount } from 'svelte';
	onMount(() => {
		// Set Airtable data to $directoryData store
		directoryData.set({
			type: 'FeatureCollection',
			features: data.airtableRecords.map((d) => {
				const obj = {
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [+d['Longitude'], +d['Latitude']]
					},
					properties: {
						...d
					}
				};
				return obj;
			})
		});
	});
</script>

<Map bind:sidebarVisible />

{#if sidebarVisible}
	<div class="sidebar-content" transition:fade={{ duration: 300 }}>
		<Sidebar bind:sidebarVisible></Sidebar>
	</div>
{:else}
	<button
		aria-label="Show sidebar"
		class="sidebar-collapsed"
		on:click|stopPropagation={() => (sidebarVisible = !sidebarVisible)}
	>
		<ListIcon />
	</button>
{/if}

<style>
	.sidebar-content {
		position: relative;
		max-width: 375px;
		max-height: calc(100svh - 8rem);
		border-radius: 5px;
		background-color: rgba(255, 255, 255, 0.75);
		top: 0;
		z-index: 1;
		margin: 2rem;
		box-shadow: 0px 0px 24px 3px rgba(255, 255, 255, 0.2);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		z-index: 2;
	}

	.sidebar-collapsed {
		position: absolute;
		top: 0;
		margin: 2rem;
		background-color: transparent;
		border: 0;
	}
</style>
