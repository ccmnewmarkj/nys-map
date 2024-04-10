<script>
	// Import components
	import ResetMap from '$lib/components/ResetMap.svelte';

	// Import icon components
	import ResetIcon from '$lib/components/icons/Reset.svelte';

	// Initialize map
	import { onMount, onDestroy } from 'svelte';

	// Packages
	import mapboxgl from 'mapbox-gl';
	import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';

	// Stores
	import { map } from '$lib/stores.js';

	// Import transition
	import { fade } from 'svelte/transition';

	let mapContainer;
	const centerMap = { lng: -75.2, lat: 42.9 };

	mapboxgl.accessToken =
		'pk.eyJ1IjoiamVuY2hlIiwiYSI6ImNsdDlhNWNtdTBnOXEybW5wMmxxMDRneGMifQ.-aAXBbQZGsiJeZ-zvOXJQA';

	// Restrict panning to bounds
	const mapBounds = [
		[-79.763, 40.5], // SW corner of the bounds
		[-71.856, 45.2] // NE corner of the bounds
	];

	// Sidebar
	export let sidebarVisible;
	let globePadding;

	$: if (sidebarVisible) {
		globePadding = { left: 400 };
	} else {
		globePadding = { left: 0 };
	}

	// Reset button
	let initialCenterLng;
	let movedCenterLng;

	onMount(() => {
		// Set up map via store
		map.set(
			new mapboxgl.Map({
				container: mapContainer,
				accessToken: mapboxgl.accessToken,
				style: 'mapbox://styles/jcccm/clusj6abq000n01qpg25rhh2b',
				center: [centerMap.lng, centerMap.lat],
				minZoom: 5,
				zoom: 6.25,
				maxZoom: 13
				//maxBounds: mapBounds
			})
		);

		// Zoom controls
		$map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

		$map.on('load', () => {
			// Establish initial center longtitude value
			initialCenterLng = $map?.getCenter().lng;
			movedCenterLng = $map?.getCenter().lng;

			// ...to determine when map has been panned/zoomed (i.e. when center longitude value has changed) for setting conditional styling on reset map button
			$map.on('move', () => {
				movedCenterLng = $map?.getCenter().lng;

				// Restrict panning to bounds
				$map?.setMaxBounds(mapBounds);
			});
		});
	});

	onDestroy(() => {
		if ($map) {
			$map.remove();
		}
	});

	// Update globe padding depending on state of sidebar
	$: $map?.easeTo({
		padding: globePadding,
		duration: 1000
	});
</script>

<!-- Map -->
<div class="map-container">
	<div class="map" bind:this={mapContainer} />
</div>

<!-- Reset button -->
<div class="btn-container">
	{#if initialCenterLng?.toFixed(1) !== movedCenterLng?.toFixed(1)}
		<div class="btn-container">
			<div class="reset-container" transition:fade={{ duration: 100 }}>
				<ResetMap><ResetIcon /></ResetMap>
			</div>
		</div>
	{/if}
</div>

<style>
	.map {
		position: absolute;
		width: 100%;
		top: 0;
		bottom: 0;
	}

	/* reset button */
	.btn-container {
		position: absolute;
		bottom: 50px;
		right: 5px;
		z-index: 1;
	}
</style>
