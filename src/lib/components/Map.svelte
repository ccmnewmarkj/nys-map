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
	// const centerMap = { lng: -75.2, lat: 42.9 };
	const centerMap = { lng: -75.9, lat: 42.9 };

	mapboxgl.accessToken =
		'pk.eyJ1IjoiamNjY20iLCJhIjoiY2xwdW9jY3IwMGt5ZTJ2b2pnMHFnNW5uciJ9.yU00BX66GK493iePPjtt3Q';

	// Restrict panning to bounds
	const mapBounds = [
		[-79.763, 40.5], // SW corner of the bounds
		[-71.856, 45.2] // NE corner of the bounds
	];

	// Sidebar
	export let sidebarVisible;
	let globePadding;

	// On desktop, shift map to the right when sidebar is visible
	$: if (sidebarVisible) {
		globePadding = { left: 400 };
	} else {
		globePadding = { left: 0 };
	}

	// Reset button
	let initialCenterLng;
	let movedCenterLng;
	// for mobile
	// let initialSWBoundsLng;
	// let initialNEBoundsLng;
	// let initialSWBoundsLngMoved;
	// let initialNEBoundsLngMoved;

	let isMobile;

	// Color by format
	const newspaperFormat = '250, 112, 112',
		radioFormat = '64, 162, 227',
		magazineFormat = '115, 144, 114',
		digitalFormat = '255, 201, 74',
		digitalFormatText = '244, 194, 81',
		otherFormat = '179, 200, 207';

	onMount(() => {
		isMobile =
			/Android|BlackBerry|IEMobile|iPod|iPhone|Opera Mini|webOS/i.test(navigator.userAgent) &&
			!/iPad|Tablet/i.test(navigator.userAgent) &&
			window.matchMedia('(max-width: 768px)').matches;

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
			placeholder: 'Enter city or address',
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
						'Digital-only',
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
						'Digital-only',
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

				// Background of header section based on format
				let headerBg =
					{
						Newspaper: newspaperFormat,
						Radio: radioFormat,
						Magazine: magazineFormat,
						'Digital-only': digitalFormat
					}[e.features[0].properties['Primary Format']] || otherFormat;

				// Icon source: https://iconoir.com/
				const openLinkIcon = `
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
					? `<a href="${e.features[0].properties['Website']}" target="_blank" class="popup-link-btn" style="color: rgba(${e.features[0].properties['Primary Format'] === 'Digital-only' ? digitalFormatText : headerBg}, 1); border: 1px solid rgba(${e.features[0].properties['Primary Format'] === 'Digital-only' ? digitalFormatText : headerBg}, 1);" aria-label="${e.features[0].properties['Media Outlet']}, website opens in a new tab">Visit Website ${openLinkIcon}</a>`
					: '';

				let locationNotes = e.features[0].properties['Location Status']
					? `${infoIcon} Map location is approximate`
					: '';

				// POPUP CONTENT
				const popupContent = `
				
			<div class="popup-header" style="background-color: rgba(${headerBg}, 0.5);">
				<p class="popup-outlet-name">${e.features[0].properties['Media Outlet']}</p>
				<p class="popup-location">${e.features[0].properties['City']}, NY ${yearFoundedValue}</p>
			</div>

			<div class="popup-body">

				<div class="popup-row">
					<p class="popup-category-label"><svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#686D76"><path d="M160-80q-17 0-28.5-11.5T120-120v-558q0-15 6-25.5t20-16.5l400-160q20-8 37 5.5t17 34.5v120h40q17 0 28.5 11.5T680-680v120h-80v-80H200v480h207l80 80H160Zm200-640h160v-62l-160 62ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm-50-100 160-100-160-100v200Zm-430 20v-480 480Z"/></svg> Primary Format</p>
					<p class="popup-category-value">${e.features[0].properties['Primary Format']}</p>
				</div>

				<hr class="outlet-card-divider" />

				<div class="popup-row">
					<p class="popup-category-label"><svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#686D76"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg> ${communityLabelValue}</p>
					<p class="popup-category-value">${JSON.parse(e.features[0].properties['Community']).join(', ')}</p>
				</div>

				<hr class="outlet-card-divider" />

				<div class="popup-row">
					<p class="popup-category-label"><svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#686D76"><path d="m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z" /></svg> ${languageLabelValue}</p>
					<p class="popup-category-value">${JSON.parse(e.features[0].properties['Language']).join(', ')}</p>
				</div>

			<hr class="outlet-card-divider" />

				${linkValue}
			</div>

			<div class="popup-footer" style="background-color: rgba(${headerBg}, 0.15);">
				${locationNotes}
			</div>
				
				`;

				popup.set(new mapboxgl.Popup().setLngLat(coordinates).setHTML(popupContent).addTo($map));
			});

			///////////////////////////
			// RESET MAP, MOBILE
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

			// Hide sidebar on mobile if map touched
			$map.on('click', () => {
				if (
					window.matchMedia('(max-width: 480px), (max-height: 480px)').matches &&
					sidebarVisible
				) {
					sidebarVisible = false;
				}
			});

			// For mobile
			if (window.matchMedia('(max-width: 512px)').matches) {
				// set bounds
				// $map.fitBounds([
				// 	[-79.75, 40.5],
				// 	[-72, 45]
				// ]);

				// set zoom level
				$map.setZoom(5);
			}
		});
	});

	onDestroy(() => {
		if ($map) {
			$map.remove();
		}
	});

	// Update globe padding depending on state of sidebar
	$: if (!isMobile)
		$map?.easeTo({
			padding: globePadding,
			duration: 1000
		});

	// Polygon toggles
	export let showCounties = false;
	export let showRegions = false;

	// Highlight selected outlet circle on map
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
<section id="map-container" aria-label="Map of media outlets across New York State">
	<div class="map" bind:this={mapContainer} />
</section>

<!-- Container for map elements -->
<section id="map-elements-container" aria-label="Map tools and features">
	<!-- Search -->
	<div class="map-elements geocoder-container">
		<fieldset>
			<legend style="width: 85px; text-align: right; line-height: 1.15;"
				>Search by NYS location</legend
			>
			<!-- <div class="geocoder-container" tabindex="-1" role="searchbox" aria-label="search"> -->
		</fieldset>
	</div>

	<!-- Toggle polygon filters -->
	<fieldset class="map-elements toggle-container">
		<legend class="sr-only">Geographic boundaries</legend>

		<PolygonToggle bind:checked={showCounties} polygonType="Counties" />

		<PolygonToggle bind:checked={showRegions} polygonType="Regions" />
	</fieldset>

	<!-- <hr class="map-elements" style="top: 8.5rem;" /> -->

	<!-- Legend -->
	<div class="map-elements legend-container">
		<Legend />
	</div>

	<!-- Button: Reset highlighted outlet -->
	{#if $selectedOutlet}
		<div class="map-elements highlight-reset-container" transition:fade={{ duration: 100 }}>
			<button
				aria-label="Remove highlight around map marker for selected outlet"
				style="font-family: 'Roboto Condensed', sans-serif; font-weight: 800; display: flex; gap: 5px;"
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
		<ResetMap {centerMap} {isMobile}><NYSIcon /></ResetMap>
	</div>
{/if}

<style>
	.map {
		position: absolute;
		width: 100%;
		top: 0;
		bottom: 0;
	}

	.map-elements {
		position: absolute;
		right: 10px;
	}

	/* hr {
		border-top: 0.5px solid rgba(0, 0, 0, 0.5);
		width: 125px;
		margin: 0.75rem 0;
	} */

	.geocoder-container {
		z-index: 1;
		/* top: 10px;
		right: 10px; */
		margin-bottom: 0.75rem;
		display: flex;
		gap: 10px;
		align-items: center;
	}

	.geocoder-container legend {
		font-family: 'Roboto Condensed', 'sans-serif;';
		text-transform: uppercase;
		font-size: 0.8rem;
		font-weight: 800;
	}

	.toggle-container {
		margin-top: 0.75rem;
		margin-bottom: 0.25rem;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		top: 4rem;
	}

	.legend-container {
		margin-top: 0.25rem;
		top: 9rem;
	}

	/* when outlet selected */
	.highlight-reset-container {
		/* margin-top: 0.75rem; */
		font-size: 12px;
		background-color: rgba(249, 232, 151, 0.5);
		border: 1px solid var(--yellow);
		border-radius: 3px;
		bottom: 154px;
	}

	.highlight-reset-container button {
		padding: 2px 5px;
	}

	/* reset map button */
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
		font-family: 'Roboto Condensed', sans-serif;
	}

	@media only screen and (max-device-width: 512px) {
		.geocoder-container {
			display: none;
		}

		.toggle-container {
			top: 10px;
		}
		.legend-container {
			top: 95px;
		}
		.highlight-reset-container {
			bottom: 180px;
		}

		.reset-container {
			bottom: 125px;
		}
	}

	fieldset {
		border: none;
		padding: 0;
	}

	/* source: https://guides.18f.gov/accessibility/hidden-content/ */
	.sr-only {
		border: 0;
		clip: rect(0 0 0 0);
		height: 1px;
		margin: -1px;
		overflow: hidden;
		padding: 0;
		position: absolute;
		width: 1px;
	}
</style>
