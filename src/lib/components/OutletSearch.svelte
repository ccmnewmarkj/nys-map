<script>
	// svelte-select for dropdown menu
	import Select from 'svelte-select';

	// Import stores
	import {
		map,
		popup,
		directoryData,
		selectedOutlet,
		selectedFormat,
		selectedCommunity,
		selectedLanguage
	} from '$lib/stores.js';

	const outletNames = $directoryData.features?.map((d) => d.properties['Media Outlet'])?.sort();

	// Set variable for selected outlet name
	let value;

	// Zoom to outlet location on map when outlet name is selected
	let lng;
	let lat;
	function flyTo(zoom, center) {
		$map.flyTo({
			zoom: zoom,
			center: center,
			essential: true
		});
	}

	// Highlight selected outlet on map
	function highlightOutlet() {
		if ($selectedOutlet) {
			$map.setPaintProperty('outlet-layer', 'circle-opacity', 0.25);
		}
	}

	// When accordion is closed, any selected outlet will be cleared
	function toggleAccordion() {
		if ($selectedOutlet) {
			value = undefined;
			$selectedOutlet = undefined;
			$popup?.remove();
			$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
			$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
		}
	}

	// Clear any selected filter values when an outlet has been selected (in search box) (and vice versa)
	$: if ($selectedOutlet === undefined) {
		value = undefined;
	}
</script>

<details on:toggle={toggleAccordion} open>
	<summary>Search by Outlet</summary>

	<p class="content">
		When an outlet is selected, any applied filters above will be cleared. The map will then zoom in
		to the outlet's location. Select the highlighted marker for more details about the outlet.
	</p>

	<form>
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
				$popup?.remove();
			}}
			on:change={() => {
				lng = $directoryData.features
					?.filter((d) => d.properties['Media Outlet'] === $selectedOutlet)
					.map((d) => d.geometry.coordinates[0]);
				lat = $directoryData.features
					?.filter((d) => d.properties['Media Outlet'] === $selectedOutlet)
					.map((d) => d.geometry.coordinates[1]);

				$directoryData.features?.map((d) => d.properties['Latitude'])[0] !== undefined
					? flyTo(10, [lng, lat])
					: null;
			}}
			on:change={highlightOutlet}
			on:clear={() => {
				$selectedOutlet = undefined;
				$popup?.remove();
				$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
				$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
			}}
		/>
	</form>
	{#if $selectedOutlet}
		<p class="content" style="font-size: 0.8rem; padding-top: 0; color: #6d6d6d;">
			To reset the selected outlet and corresponding highlighted circle, select the "Clear outlet"
			button that will appear on the map.
		</p>
	{/if}
</details>

<style>
	/* accordion styles from https://css-tricks.com/how-to-animate-the-details-element/ */
	details {
		box-sizing: border-box;
		background-color: var(--alice-blue-light);
	}

	details > summary {
		padding: 0.5rem;
		background-color: var(--blue-gray);
		font-weight: 600;
		color: white;
		cursor: pointer;
		font-family: 'Roboto Condensed', sans-serif;
		text-transform: uppercase;
	}

	/* space between arrow and text */
	summary::before {
		content: '\2008';
	}

	/* style arrow marker */
	summary::-webkit-details-marker {
		color: var(--yellow-orange);
	}
	summary::marker {
		color: var(--yellow-orange);
	}

	details[open] > summary:before {
		transform: rotate(90deg);
	}

	details > .content {
		font-size: 0.8rem;
		padding: 0.75rem;
	}

	form {
		padding: 0 0.75rem 0.75rem;
	}
</style>
