<script>
	import mapboxgl from 'mapbox-gl';
	// svelte-select for dropdown menu
	import Select from 'svelte-select';

	// Set variable for selected outlet name
	export let data;

	// Import stores
	import {
		map,
		popup,
		selectedOutlet,
		selectedFormat,
		selectedCommunity,
		selectedLanguage
	} from '$lib/stores.js';

	const outletNames = data.features?.map((d) => d.properties['Media Outlet'])?.sort();

	// Set variable for selected outlet name
	let value;
	let lng;
	let lat;

	// Zoom to outlet location on map when outlet name is selected
	function flyTo(zoom, center) {
		$map.flyTo({
			zoom: zoom,
			center: center,
			essential: true
		});
	}

	function highlightOutlet() {
		if ($selectedOutlet) {
			$map.setPaintProperty('outlet-layer', 'circle-opacity', 0.25);
		}
	}

	function toggleAccordion() {
		if ($selectedOutlet) {
			value = undefined;
			$selectedOutlet = undefined;
			$popup?.remove();
			$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
			$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
		}
	}

	// Clear any selected filter values when an outlet has been selected (in search box)
	$: if ($selectedOutlet === undefined) {
		value = undefined;
	}

	// $: console.log('selectedOutlet:', $selectedOutlet);
	// $: console.log('value:', value);
</script>

<details on:toggle={toggleAccordion}>
	<summary>Search by Outlet</summary>
	<div class="content">
		<p>
			When an outlet is selected, any applied filters above will be cleared. The map will then zoom
			in to the outlet's location and a popup at its corresponding marker will appear containing
			details about the outlet.
		</p>
		<!-- <p style="font-size: 0.8rem; margin-top: 0.5rem;">
			<strong>Note:</strong> The selection not affect the values of the three filters or the list
			under the <span class="tab">Outlets</span> tab.
		</p> -->
	</div>
	<form>
		<!-- <label for="outlet-search">Search by media outlet</label> -->
		<Select
			id="outlet-search"
			items={outletNames}
			placeholder="Find outlet name"
			bind:value
			on:change={() => {
				$selectedFormat ? ($selectedFormat = undefined) : null;
				$selectedCommunity ? ($selectedCommunity = undefined) : null;
				$selectedLanguage ? ($selectedLanguage = undefined) : null;
				$selectedOutlet = value?.value;
			}}
			on:change={() => {
				lng = data.features
					?.filter((d) => d.properties['Media Outlet'] === $selectedOutlet)
					.map((d) => d.geometry.coordinates[0]);
				lat = data.features
					?.filter((d) => d.properties['Media Outlet'] === $selectedOutlet)
					.map((d) => d.geometry.coordinates[1]);

				data.features?.map((d) => d.properties['Latitude'])[0] !== undefined
					? flyTo(10, [lng, lat])
					: null;
			}}
			on:change={highlightOutlet}
			on:clear={() => {
				$selectedOutlet = undefined;
				$popup?.remove();
			}}
			on:clear={() => {
				$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
				$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
			}}
		/>
	</form>
</details>

<style>
	/* remove accordion arrow */
	/* details > summary {
		display: block; 
	} */

	/* accordion styles from https://css-tricks.com/how-to-animate-the-details-element/ */
	details {
		box-sizing: border-box;
		background: rgba(81, 130, 155, 0.1);
	}

	details > summary {
		padding: 0.5rem;
		display: block;
		background: var(--blue-gray);
		font-weight: 600;
		color: white;
		padding-left: 2.2rem;
		position: relative;
		cursor: pointer;
	}

	details[open] > summary:before {
		transform: rotate(90deg);
	}
	details > summary:before {
		content: '';
		border-width: 0.4rem;
		border-style: solid;
		border-color: transparent transparent transparent var(--yellow-orange);
		position: absolute;
		top: 0.65rem;
		left: 1rem;
		transform: rotate(0);
		transform-origin: 0.2rem 50%;
		transition: 0.25s transform ease;
	}

	details > .content {
		font-size: 0.85rem;
		padding: 0.75rem;
	}

	form {
		padding: 0 0.75rem 0.75rem;
	}
</style>
