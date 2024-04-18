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

	// Color by format
	const newspaperFormat = '250, 112, 112';
	const radioFormat = '64, 162, 227';
	const magazineFormat = '115, 144, 114';
	const digitalFormat = '255, 201, 74';
	const otherFormat = '179, 200, 207';

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
					'circle-radius': {
						base: 1.75,
						stops: [
							[8, 6],
							[15, 24]
						]
					},
					'circle-stroke-width': 1.25,
					'circle-stroke-color': 'white',
					'circle-color': [
						'match',
						['get', 'Primary Format'],
						'Newspaper',
						`rgba(${newspaperFormat}, 1)`,
						'Radio',
						`rgba(${radioFormat}, 1)`,
						'Magazine',
						`rgba(${magazineFormat}, 1)`,
						'Digital only',
						`rgba(${digitalFormat}, 1)`,
						/* other */ `rgba(${otherFormat}, 1)`
					]
				}
			});

			// Cursor becomes pointer when on point
			$map.on('mouseenter', 'outlet-layer', () => {
				$map.getCanvas().style.cursor = 'pointer';
			});

			// Cursor goes back to default off point
			$map.on('mouseleave', 'outlet-layer', () => {
				$map.getCanvas().style.cursor = '';
			});

			// Same for outlet search layer
			$map.on('mouseenter', 'outlet-search-layer', () => {
				$map.getCanvas().style.cursor = 'pointer';
			});

			$map.on('mouseleave', 'outlet-search-layer', () => {
				$map.getCanvas().style.cursor = '';
			});

			///////////////////////////
			// HIGHLIGHTED OUTLET from Outlet Search
			///////////////////////////

			$map.addLayer({
				id: 'outlet-search-layer',
				type: 'circle',
				source: 'outlets',
				paint: {
					'circle-radius': {
						base: 1.75,
						stops: [
							[8, 8],
							[15, 30]
						]
					},
					//'circle-radius': 8,
					'circle-stroke-width': 2.5,
					'circle-stroke-color': 'yellow',
					'circle-color': [
						'match',
						['get', 'Primary Format'],
						'Newspaper',
						`rgba(${newspaperFormat}, 1)`,
						'Radio',
						`rgba(${radioFormat}, 1)`,
						'Magazine',
						`rgba(${magazineFormat}, 1)`,
						'Digital only',
						`rgba(${digitalFormat}, 1)`,
						/* other */ `rgba(${otherFormat}, 1)`
					]
				}
			});

			// Initially hide all markers in outlet-search-layer
			// When outlet name is selected, circle will be in different opacity
			$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);

			///////////////////////////
			// POPUP
			///////////////////////////

			$map.on('click', ['outlet-layer', 'outlet-search-layer'], (e) => {
				const coordinates = e.features[0].geometry.coordinates.slice();

				// "Ensure that if the map is zoomed out such that multiple
				// copies of the feature are visible, the popup appears
				// over the copy being pointed to."
				while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
					coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
				}

				//selectedOutlet.set(e.features[0].properties['Media Outlet']);

				// Background of header section based on format
				let headerBg;
				if (e.features[0].properties['Primary Format'] === 'Newspaper') {
					headerBg = newspaperFormat;
				} else if (e.features[0].properties['Primary Format'] === 'Radio') {
					headerBg = radioFormat;
				} else if (e.features[0].properties['Primary Format'] === 'Magazine') {
					headerBg = magazineFormat;
				} else if (e.features[0].properties['Primary Format'] === 'Digital only') {
					headerBg = digitalFormat;
				} else {
					headerBg = otherFormat;
				}

				// Icon source: https://iconoir.com/
				const arrowUpRightIcon = `
				<svg
					width="20px"
					height="20px"
					viewBox="0 0 24 24"
					stroke-width="1.75"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					color="#000000"
					><path
						d="M9.17137 14.8284L14.8282 9.17152M14.8282 9.17152H9.87848M14.8282 9.17152V14.1213"
						stroke="rgba(${headerBg}, 1)"
						stroke-width="1.75"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path><path
						d="M21 3.6V20.4C21 20.7314 20.7314 21 20.4 21H3.6C3.26863 21 3 20.7314 3 20.4V3.6C3 3.26863 3.26863 3 3.6 3H20.4C20.7314 3 21 3.26863 21 3.6Z"
						stroke="rgba(${headerBg}, 1)"
						stroke-width="1.75"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path></svg
				>
				`;

				const infoIcon = `
				<svg
					width="12px"
					height="12px"
					stroke-width="2.5"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					color="#000000"
					><path
						d="M12 11.5V16.5"
						stroke="#000000"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path><path
						d="M12 7.51L12.01 7.49889"
						stroke="#000000"
						stroke-width="2.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path><path
						d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
						stroke="#000000"
						stroke-width="2.1"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path></svg
				>
				`;

				// Conditional popup values

				let yearFoundedValue = e.features[0].properties['Year Founded']
					? ` • Founded in ${e.features[0].properties['Year Founded']}`
					: '';

				let communityLabelValue =
					JSON.parse(e.features[0].properties['Community']).length > 1
						? 'Communities'
						: 'Community';

				let languageLabelValue =
					JSON.parse(e.features[0].properties['Language']).length > 1 ? 'Languages' : 'Language';

				let linkValue = e.features[0].properties['Website']
					? `<a href="${e.features[0].properties['Website']}" target="_blank" class="popup-link-btn" style="color: rgba(${headerBg}, 1); border: 1px solid rgba(${headerBg}, 0.5);">Visit Website ${arrowUpRightIcon}</a>`
					: '';

				let locationNotes = e.features[0].properties['Location Status']
					? `${infoIcon} Map location is approximate`
					: '';

				// POPUP

				const popupContent = `
				
			<div class="popup-header" style="background-color: rgba(${headerBg}, 0.5);">
				<p class="popup-outlet-name">${e.features[0].properties['Media Outlet']}</p>
				<p class="popup-location">${e.features[0].properties['City']}, NY ${yearFoundedValue}</p>
			</div>

			<div class="popup-body">
				<div class="popup-row">
					<p class="popup-category-label">Primary Format</p>
					<p class="popup-category-value">${e.features[0].properties['Primary Format']}</p>
				</div>

				<hr />

				<div class="popup-row">
					<p class="popup-category-label">${communityLabelValue}</p>
					<p class="popup-category-value">${JSON.parse(e.features[0].properties['Community']).join(', ')}</p>
				</div>

				<hr />

				<div class="popup-row">
					<p class="popup-category-label">${languageLabelValue}</p>
					<p class="popup-category-value">${JSON.parse(e.features[0].properties['Language']).join(', ')}</p>
				</div>

				<hr />

				${linkValue}
			</div>

			<div class="popup-footer" style="background-color: rgba(${headerBg}, 0.15);">
				${locationNotes}
			</div>
				
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

	// Show selected outlet circle on map
	$: if ($selectedOutlet) {
		$map.setFilter('outlet-search-layer', [
			'any',
			['in', $selectedOutlet, ['get', 'Media Outlet']]
		]);
	}
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
