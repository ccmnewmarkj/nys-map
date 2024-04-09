<script>
	// Initialize map
	import { onMount, onDestroy } from 'svelte';

	// Packages
	import mapboxgl from 'mapbox-gl';
	import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';

	// Stores
	import { map } from '$lib/stores.js';

	let mapContainer;
	const centerMap = { lng: -74.2, lat: 43.3 };

	mapboxgl.accessToken =
		'pk.eyJ1IjoiamVuY2hlIiwiYSI6ImNsdDlhNWNtdTBnOXEybW5wMmxxMDRneGMifQ.-aAXBbQZGsiJeZ-zvOXJQA';

	onMount(() => {
		// Set up map via store
		map.set(
			new mapboxgl.Map({
				container: mapContainer,
				accessToken: mapboxgl.accessToken,
				style: 'mapbox://styles/jenche/ckwomfiv01w0515oh8u88uvp5',
				center: [centerMap.lng, centerMap.lat],
				zoom: 5.5,
				maxZoom: 13
			})
		);

		// Set up bounding box
		// Source: https://observablehq.com/@rdmurphy/u-s-state-bounding-boxes
		$map.fitBounds([
			[-79.763, 40.5], // SW corner of the bounds
			[-71.856, 45.2] // NE corner of the bounds
		]);
	});

	onDestroy(() => {
		if ($map) {
			$map.remove();
		}
	});
</script>

<div class="map-container">
	<div class="map" bind:this={mapContainer} />
</div>

<style>
	.map {
		position: absolute;
		width: 100%;
		top: 0;
		bottom: 0;
	}
</style>
