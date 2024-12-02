<script>
	// Stores
	import { map } from '$lib/stores.js';

	export let checked;
	export let polygonType;

	function showPolygons() {
		if (polygonType === 'Counties') {
			$map?.setLayoutProperty('county-border-layer', 'visibility', 'visible');
			$map?.setLayoutProperty('county-labels', 'visibility', 'visible');
		}
		if (polygonType === 'Regions') {
			$map?.setLayoutProperty('region-border-layer', 'visibility', 'visible');
			$map?.setLayoutProperty('region-labels', 'visibility', 'visible');
		}
	}

	function clearPolygons() {
		if (polygonType === 'Counties') {
			$map?.setLayoutProperty('county-border-layer', 'visibility', 'none');
			$map?.setLayoutProperty('county-labels', 'visibility', 'none');
		}
		if (polygonType === 'Regions') {
			$map?.setLayoutProperty('region-border-layer', 'visibility', 'none');
			$map?.setLayoutProperty('region-labels', 'visibility', 'none');
		}
	}
</script>

<!-- Toggle switch based on https://www.w3.org/WAI/ARIA/apg/patterns/switch/examples/switch-checkbox/ -->
<label
	for={polygonType}
	class="toggle"
	aria-label={checked ? `Hide boundaries for ${polygonType}` : `Show boundaries for ${polygonType}`}
	><span class="toggle-text">Show {polygonType}</span>
	<input
		type="checkbox"
		role="switch"
		id={polygonType}
		bind:checked
		on:change={() => {
			if (checked) {
				showPolygons();
			} else {
				clearPolygons();
			}
		}}
	/><span class="toggle-state">
		<span class="toggle-container">
			<span class="text" class:active={checked} aria-hidden="true"
				>{#if checked}On
				{:else}Off{/if}</span
			>
			<span class="switch"> </span></span
		>
	</span></label
>

<style>
	label {
		display: block;
		padding: 4px 0 4px;
		border: 0 solid rgba(71, 147, 175, 0.75); /* prevents jumping */
		border-radius: 5px;
		cursor: pointer;
		font-family: 'Roboto Condensed', 'sans-serif;';
	}

	label > .toggle-text {
		margin-right: 0.2rem;
		text-transform: uppercase;
		font-size: 0.8rem;
		font-weight: 800;
	}

	/* checkbox */
	input[role='switch'] {
		width: 0;
		height: 0;
	}

	/* toggle-container */
	label input[role='switch'] ~ .toggle-state > .toggle-container {
		position: relative;
		top: 1px;
		display: inline-block;
		border: 1.5px solid white;
		background-color: rgba(204, 204, 204, 1);
		width: 42px;
		height: 21px;
		border-radius: 10px;
	}

	/* toggle-container when switch checked */
	label input[role='switch']:checked ~ .toggle-state > .toggle-container {
		background-color: rgba(71, 147, 175, 0.75);
	}

	/* switch */
	label input[role='switch'] ~ .toggle-state > .toggle-container > .switch {
		position: relative;
		top: 1.5px;
		left: 3px;
		display: inline-block;
		border-radius: 9px;
		width: 14px;
		height: 14px;
		background: white;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	/* switch on/off label */
	label input[role='switch'] ~ .toggle-state > .toggle-container > .text {
		font-size: 0.7rem;
		text-transform: uppercase;
		position: absolute;
		top: 2.5px;
		right: 3px;
	}

	/* switch on/off label when checked */
	label input[role='switch'] ~ .toggle-state > .toggle-container > .active {
		right: auto;
		left: 4px;
		color: var(--white);
	}

	/* switch checked */
	label input[role='switch']:checked ~ .toggle-state > .toggle-container > .switch {
		left: 22px;
	}

	label:focus-within {
		padding: 2px 2px 4px 4px;
		border-width: 2px;
		border-radius: 10px;
	}
</style>
