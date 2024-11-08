<script>
	// Import components
	import Map from '$lib/components/Map.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	// Import icon components
	import ListIcon from '$lib/components/icons/ListOpen.svelte';

	// Import transition
	import { fade } from 'svelte/transition';

	// Set state of sidebar
	let sidebarVisible = true;

	// Import data for state regions
	import regions from '$lib/data/Regional_Economic_Development_Councils.json';
	import counties from '$lib/data/Counties_Shoreline-simplified.json';

	// Import directory data
	export let data; // Airtable directory data
	import { directoryData, filteredDirectory, countyPolygons, regionPolygons } from '$lib/stores.js';

	// Create Turf modules
	import centroid from '@turf/centroid';

	import { onMount } from 'svelte';

	// Variable for checking for duplicate coordinates
	let longitudeValue;

	onMount(() => {
		// Set Airtable data to $directoryData store
		directoryData.set({
			type: 'FeatureCollection',
			features: data.airtableRecords
				.map((d) => {
					const obj = {
						type: 'Feature',
						geometry: {
							type: 'Point',
							coordinates: [+d['Longitude'], +d['Latitude']]
						},
						properties: {
							...d,
							'Primary Format': d['Primary Format']?.toString()
						}
					};
					return obj;
				})
				.filter((d) => d.properties['Status'] === 'Active')
				// When sorting only, remove "The ", "La ", or "El " from the beginning of outlet name for alphabetizing
				.sort((a, b) => {
					const nameA = a.properties['Media Outlet'].replace(/^(The|La|El)\s+/i, '');
					const nameB = b.properties['Media Outlet'].replace(/^(The|La|El)\s+/i, '');

					return nameA.localeCompare(nameB);
				})
		});

		// Set filteredDirectory to include all outlets as its initial state
		filteredDirectory.set($directoryData);

		// Check for duplicate coordinates
		$directoryData.features.forEach((d) => {
			longitudeValue = d.properties.Longitude;
			if (
				$directoryData.features
					.filter((e) => e.properties['Media Outlet'] !== d.properties['Media Outlet'])
					.filter((e) => e.properties.Longitude)
					.filter((e) => e.properties.Longitude === longitudeValue).length > 0
			) {
				// Add column indicating duplicate coordinates
				d.properties.duplicateCoords = true;
				// Nudge coordinates apart
				(d.geometry.coordinates[0] = d.geometry.coordinates[0] + (Math.random() - 0.5) * 0.002),
					(d.geometry.coordinates[1] = d.geometry.coordinates[1] + (Math.random() - 0.5) * 0.002);
				// Add loc approx column
				//d.properties['Location approximate'] = 'Location approximate';
			} else {
				d.properties.duplicateCoords = false;
			}
		});

		// COUNTIES
		// Add centroid point for polygon labels
		counties.features.forEach((d) => {
			d.centroid = centroid({
				type: 'Feature',
				geometry: d.geometry
			});
		});
		// Set polygons as feature collection
		countyPolygons.set({
			type: 'FeatureCollection',
			features: counties.features
		});

		// REGIONS
		// Add centroid point for polygon labels
		regions.features.forEach((d) => {
			d.centroid = centroid({
				type: 'Feature',
				geometry: d.geometry
			});
		});
		// Set polygons as feature collection
		regionPolygons.set({
			type: 'FeatureCollection',
			features: regions.features
		});
	});
</script>

<!-- Map -->
<Map bind:sidebarVisible />

<!-- Sidebar -->
<section id="sidebar-container" aria-labelledby="sidebar-title">
	{#if sidebarVisible}
		<div class="sidebar-content" transition:fade={{ duration: 300 }}>
			<Sidebar bind:sidebarVisible></Sidebar>
		</div>
	{:else}
		<!-- Sidebar toggle -->
		<button
			aria-label="Show sidebar"
			class="sidebar-collapsed"
			on:click|stopPropagation={() => (sidebarVisible = !sidebarVisible)}
		>
			<ListIcon />
		</button>
	{/if}
</section>

<style>
	.sidebar-content {
		position: relative;
		max-width: 375px;
		max-height: calc(100vh - 3rem);
		max-height: calc(100svh - 3rem);
		border-radius: 5px;
		background-color: rgba(255, 255, 255, 0.85);
		top: 0;
		z-index: 2; /* above zoom controls */
		margin: 1rem;
		box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border: 0.75px solid var(--blue-gray);
	}

	.sidebar-collapsed {
		position: absolute;
		top: 0;
		margin: 1rem; /* 2rem; */
		background-color: transparent;
		border: 0;
	}

	@media only screen and (max-device-width: 512px) {
		.sidebar-content {
			max-height: calc(100vh - 2rem);
			max-height: calc(100svh - 2rem);
		}
	}
</style>
