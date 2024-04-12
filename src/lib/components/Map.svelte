<script>
	// Import components
	import ResetMap from '$lib/components/ResetBtn.svelte';
	import PolygonToggle from '$lib/components/PolygonToggle.svelte';

	// Import icon components
	import NYSIcon from '$lib/components/icons/NYS.svelte';

	// Initialize map
	import { onMount, onDestroy } from 'svelte';

	// Packages
	import mapboxgl from 'mapbox-gl';
	import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';

	// Import stores
	import {
		map,
		popup,
		directoryData,
		selectedOutlet,
		countyPolygons,
		regionPolygons
	} from '$lib/stores.js';

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
			})
		);

		// Zoom controls
		$map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

		$map.on('load', () => {
			///////////////////////////
			// POLYGONS
			///////////////////////////

			// Add county polygons
			$map.addSource('counties', {
				type: 'geojson',
				data: $countyPolygons
			});

			// Add fill color for counties
			// $map.addLayer({
			// 	id: 'county-layer',
			// 	type: 'fill',
			// 	source: 'counties',
			// 	layout: {},
			// 	paint: {
			// 		'fill-color': 'red',
			// 		'fill-opacity': 0.05
			// 	}
			// });

			// Add border for county polygons
			$map.addLayer({
				id: 'county-border-layer',
				type: 'line',
				source: 'counties',
				layout: {},
				paint: {
					'line-color': 'rgba(155, 176, 193, 0.75)',
					'line-width': {
						base: 0,
						stops: [
							[5, 0],
							[6, 0.75],
							[8, 1]
						]
					}
				}
			});

			// Add data for county labels at centroid
			$map.addSource('countyLabels', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: $countyPolygons.features?.map((d) => ({
						type: 'Feature',
						properties: {
							name: `${d.properties.NAME}`
						},
						geometry: {
							type: 'Point',
							coordinates: d.centroid.geometry.coordinates
						}
					}))
				}
			});

			// Add county labels
			$map.addLayer({
				id: 'county-labels',
				type: 'symbol',
				source: 'countyLabels',
				layout: {
					'text-field': ['get', 'name'],
					'text-font': ['DIN Offc Pro Italic'],
					'text-offset': [0, 0],
					'text-anchor': 'center',
					'text-size': {
						base: 0,
						stops: [
							[6, 0],
							[8, 12],
							[10, 14]
						]
					}
				},
				paint: {
					'text-color': '#596d7d'
				}
			});

			// Add region polygons
			$map.addSource('regions', {
				type: 'geojson',
				data: $regionPolygons
			});

			// Add fill color for regions
			$map.addLayer({
				id: 'region-layer',
				type: 'fill',
				source: 'regions',
				layout: {},
				paint: {
					'fill-color': 'transparent',
					'fill-opacity': 0.05
				}
			});

			// Add border for region polygons
			$map.addLayer({
				id: 'region-border-layer',
				type: 'line',
				source: 'regions',
				layout: {},
				paint: {
					'line-color': '#51829b',
					'line-width': {
						base: 0,
						stops: [
							[5, 0.75],
							[6, 1],
							[8, 1.25]
						]
					}
				}
			});

			// Add data for region labels at centroid
			$map.addSource('regionLabels', {
				type: 'geojson',
				data: {
					type: 'FeatureCollection',
					features: $regionPolygons.features?.map((d) => ({
						type: 'Feature',
						properties: {
							name: `${d.properties.REDC}`
						},
						geometry: {
							type: 'Point',
							coordinates: d.centroid.geometry.coordinates
						}
					}))
				}
			});

			// Add region labels
			$map.addLayer({
				id: 'region-labels',
				type: 'symbol',
				source: 'regionLabels',
				layout: {
					'text-field': ['get', 'name'],
					'text-font': ['DIN Offc Pro Italic'],
					'text-offset': [0, 0],
					'text-anchor': 'center',
					'text-size': {
						base: 0,
						stops: [
							[6, 0],
							[8, 16],
							[10, 18]
						]
					}
				},
				paint: {
					'text-color': '#0c485f'
				}
			});

			// Hide county polygons on initial load
			//$map?.setLayoutProperty('county-layer', 'visibility', 'none');
			$map?.setLayoutProperty('county-border-layer', 'visibility', 'none');
			$map?.setLayoutProperty('county-labels', 'visibility', 'none');

			// Hide region polygons on initial load
			//$map?.setLayoutProperty('region-layer', 'visibility', 'none');
			$map?.setLayoutProperty('region-border-layer', 'visibility', 'none');
			$map?.setLayoutProperty('region-labels', 'visibility', 'none');

			///////////////////////////
			// POINTS
			///////////////////////////

			// Add markers for outlets
			$map.addSource('outlets', {
				type: 'geojson',
				data: $directoryData
			});

			$map.addLayer({
				id: 'outlet-layer',
				type: 'circle',
				source: 'outlets',
				paint: {
					'circle-radius': 6,
					'circle-stroke-width': 1.5,
					'circle-color': 'rgba(255, 130, 0, 0.9)',
					'circle-stroke-color': 'white'
				}
			});

			// cursor becomes pointer when on point
			$map.on('mouseenter', 'outlet-layer', () => {
				$map.getCanvas().style.cursor = 'pointer';
			});

			// cursor goes back to default off point
			$map.on('mouseleave', 'outlet-layer', () => {
				$map.getCanvas().style.cursor = '';
			});

			///////////////////////////
			// POPUP
			///////////////////////////

			$map.on('click', ['outlet-layer'], (e) => {
				const coordinates = e.features[0].geometry.coordinates.slice();
				//selectedOutlet.set(e.features[0].properties['Media Outlet']);

				///// popup content
				const popupContent = `
				
				${e.features[0].properties['Media Outlet']}
				
				`;

				popup.set(new mapboxgl.Popup().setLngLat(coordinates).setHTML(popupContent).addTo($map));
			});

			///////////////////////////
			// RESET MAP
			///////////////////////////

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

	// Polygon toggles
	export let showCounties = false;
	export let showRegions = false;
</script>

<!-- Map -->
<div class="map-container">
	<div class="map" bind:this={mapContainer} />
</div>

<!-- Toggle filters -->
<div class="toggle-container">
	<div>
		<PolygonToggle
			bind:checked={showCounties}
			polygonType="Counties"
			--bg="rgba(155, 176, 193, 1)"
		/>
	</div>
	<div>
		<PolygonToggle bind:checked={showRegions} polygonType="Regions" --bg="var(--cerulean)" />
	</div>
</div>

<!-- Reset button -->
<div class="btn-container">
	{#if initialCenterLng?.toFixed(1) !== movedCenterLng?.toFixed(1)}
		<div class="btn-container">
			<div class="reset-container" transition:fade={{ duration: 100 }}>
				<ResetMap><NYSIcon /></ResetMap>
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

	.toggle-container {
		position: absolute;
		top: 25px;
		right: 10px;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 3px;
	}
</style>
