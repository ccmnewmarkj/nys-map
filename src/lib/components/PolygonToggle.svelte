<script>
	// Stores
	import { map } from '$lib/stores.js';

	export let checked;
	export let polygonType;

	function showPolygons() {
		if (polygonType === 'Counties') {
			//$map?.setLayoutProperty('county-layer', 'visibility', 'visible');
			$map?.setLayoutProperty('county-border-layer', 'visibility', 'visible');
			$map?.setLayoutProperty('county-labels', 'visibility', 'visible');
		}
		if (polygonType === 'Regions') {
			//$map?.setLayoutProperty('region-layer', 'visibility', 'visible');
			$map?.setLayoutProperty('region-border-layer', 'visibility', 'visible');
			$map?.setLayoutProperty('region-labels', 'visibility', 'visible');
		}
	}

	function clearPolygons() {
		if (polygonType === 'Counties') {
			//$map?.setLayoutProperty('county-layer', 'visibility', 'none');
			$map?.setLayoutProperty('county-border-layer', 'visibility', 'none');
			$map?.setLayoutProperty('county-labels', 'visibility', 'none');
		}
		if (polygonType === 'Regions') {
			//$map?.setLayoutProperty('region-layer', 'visibility', 'none');
			$map?.setLayoutProperty('region-border-layer', 'visibility', 'none');
			$map?.setLayoutProperty('region-labels', 'visibility', 'none');
		}
	}
</script>

<span class="toggle-text">Show {polygonType}</span>
<label for={polygonType} class="toggle">
	<input
		type="checkbox"
		id={polygonType}
		bind:checked
		on:change={() => {
			if (checked) {
				showPolygons();
			} else {
				clearPolygons();
			}
		}}
	/>
	<span class="switch"></span>
</label>

<style>
	.toggle-text {
		margin-right: 0.2rem;
		text-transform: uppercase;
		font-size: 0.8rem;
		font-weight: 800;
		font-family: 'Roboto Condensed', 'sans-serif;';
	}

	input[type='checkbox'] {
		visibility: hidden;
		width: 0;
		height: 0;
	}

	.toggle {
		position: relative;
		display: inline-block;
		width: 34px;
		height: 20px;
	}

	.switch {
		position: absolute;
		content: '';
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		border-radius: 20px;
		-webkit-transition: 0.3s;
		transition: 0.3s;
		cursor: pointer;
		border: 1px solid var(--white);
	}

	.switch:before {
		position: absolute;
		content: '';
		height: 14px;
		width: 14px;
		top: 2px;
		left: 3px;
		background-color: #fff;
		-webkit-transition: 0.4s;
		transition: 0.3s;
		border-radius: 50%;
	}

	input:checked + .switch {
		background-color: var(--bg);
		background-color: rgba(155, 176, 193, 1);
	}

	input:checked + .switch:before {
		-webkit-transform: translateX(12px);
		-ms-transform: translateX(12px);
		transform: translateX(12px);
	}
</style>
