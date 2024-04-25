<script>
	// Import components
	import ResetMap from '$lib/components/ResetBtn.svelte';
	import PolygonToggle from '$lib/components/PolygonToggle.svelte';
	import Legend from '$lib/components/MapLegend.svelte';

	// Import icon components
	import NYSIcon from '$lib/components/icons/NYS.svelte';

	// Initialize map
	import { onMount, onDestroy } from 'svelte';

	// Packages
	import mapboxgl from 'mapbox-gl';
	import '../../../node_modules/mapbox-gl/dist/mapbox-gl.css';
	import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

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
	const newspaperFormat = '250, 112, 112',
		radioFormat = '64, 162, 227',
		magazineFormat = '115, 144, 114',
		digitalFormat = '255, 201, 74',
		digitalFormatText = '244, 194, 81',
		otherFormat = '179, 200, 207';

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

		// Geocoder
		const geocoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken,
			placeholder: 'Search by NYS address',
			mapboxgl: mapboxgl,
			// marker: true,
			marker: {
				color: '#ff8200' // '#3189CB'
			},
			zoom: 10,
			countries: 'us',
			bbox: [-79.76, 40.48, -71.79, 45.02]
		});

		// Add geocoder to HTML element for tabbing order
		let geocoderEl = document.querySelector('.geocoder-container');
		geocoderEl.appendChild(geocoder.onAdd($map));

		// Add ID to geocoder
		const inputElement = document.querySelector('input[class="mapboxgl-ctrl-geocoder--input"]');
		inputElement.setAttribute('id', 'geocoder');

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
							[5, 0.5],
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
							[15, 18]
						]
					},
					'circle-stroke-width': 1.5,
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
							[8, 7],
							[15, 24]
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
				const openLink = `
				<svg
					width="14px"
					height="14px"
					viewBox="0 0 24 24"
					stroke-width="2.1"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					color="#000000"
					><path
						d="M21 3L15 3M21 3L12 12M21 3V9"
						stroke="rgba(${headerBg}, 1)"
						stroke-width="2.1"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path><path
						d="M21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H11"
						stroke="rgba(${headerBg}, 1)"
						stroke-width="2.1"
						stroke-linecap="round"
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
					? `<a href="${e.features[0].properties['Website']}" target="_blank" class="popup-link-btn" style="color: rgba(${e.features[0].properties['Primary Format'] === 'Digital only' ? digitalFormatText : headerBg}, 1); border: 1px solid rgba(${e.features[0].properties['Primary Format'] === 'Digital only' ? digitalFormatText : headerBg}, 1);">Visit Website ${openLink}</a>`
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

<!-- Geocoder CSS -->
<svelte:head>
	<link
		rel="stylesheet"
		href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v5.0.0/mapbox-gl-geocoder.css"
		type="text/css"
	/>
</svelte:head>

<!-- Map -->
<section class="map-container">
	<div class="map" bind:this={mapContainer} />
</section>

<!-- Container for map elements -->
<section class="map-elements-container">
	<!-- Geocoder -->
	<div class="geocoder-container" tabindex="0" role="searchbox" aria-label="search" />

	<!-- Toggle polygon filters -->
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
	<hr />
	<!-- Legend -->
	<div class="legend-container">
		<Legend />
	</div>

	<!-- Reset highlighted outlet -->
	{#if $selectedOutlet}
		<hr />
		<div class="highlight-reset-container" transition:fade={{ duration: 100 }}>
			<button
				style="font-family: 'Roboto Condensed', sans-serif; font-weight: 900; display: flex; gap: 5px;"
				on:click|stopPropagation={() => {
					$selectedOutlet = undefined;
					$popup?.remove();
					$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
					$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
				}}><span style="color: red; font-weight: 800;">✕</span>Clear outlet</button
			>
		</div>
	{/if}
</section>

<!-- Reset button -->
{#if initialCenterLng?.toFixed(1) !== movedCenterLng?.toFixed(1)}
	<div class="reset-container" transition:fade={{ duration: 100 }}>
		RESET
		<ResetMap><NYSIcon /></ResetMap>
	</div>
{/if}

<style>
	.map {
		position: absolute;
		width: 100%;
		top: 0;
		bottom: 0;
	}

	.map-elements-container {
		position: absolute;
		right: 10px;
		top: 1rem;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
	}

	hr {
		border-top: 0.5px solid rgba(0, 0, 0, 0.5);
		width: 125px;
	}

	.geocoder-container {
		z-index: 1;
		top: 10px;
		right: 10px;
		margin-bottom: 0.75rem;
	}

	/* @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
    .geocoder-container {
      top: 3.25rem;
      right: -5px;
    }
  } */

	.toggle-container {
		margin-top: 0.75rem;
		margin-bottom: 0.25rem;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		row-gap: 3px;
	}

	.legend-container {
		margin-top: 0.25rem;
	}

	.highlight-reset-container {
		margin-top: 0.75rem;
		font-size: 12px;
		background-color: rgba(249, 232, 151, 0.5);
		border: 1px solid #fff455;
		border-radius: 3px;
		padding: 0px 2px;
	}

	/* reset button */
	.reset-container {
		position: absolute;
		bottom: 100px;
		right: 10px;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		font-size: 12px;
		font-weight: 600;
		gap: 1px;
	}
</style>
