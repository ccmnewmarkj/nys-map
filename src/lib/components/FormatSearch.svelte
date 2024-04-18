<script>
	// svelte-select for dropdown menu
	import Select from 'svelte-select';

	// Import stores
	import { map, selectedFormat, filteredDirectory, selectedOutlet, popup } from '$lib/stores.js';

	// List of formats for dropdown menu
	$: formatList = [
		...new Set(
			$filteredDirectory.features
				?.map((d) => d.properties['Primary Format'])
				?.flatMap((d) => d)
				.sort()
		)
	];

	// Selected values in dropdown remain in place even after going to another panel
	let value;
	let justValue;

	let formatHeader;
	$: if ($selectedFormat) {
		if (formatList.length > 1) {
			formatHeader = `Search from <span style="color: var(--cerulean);">${formatList.length} formats</span>`;
		} else if (formatList.length === 1) {
			formatHeader = 'no additional formats available';
		}
	} else {
		formatHeader =
			formatList.length > 1
				? `Search from ${formatList.length} formats`
				: `Search from ${formatList.length} format`;
	}

	// Clear $selectedFormat values when clear button is selected
	function handleClear() {
		if ($selectedFormat.length > 1) {
			if (value === undefined) {
				$selectedFormat = undefined;
			} else {
				$selectedFormat = justValue;
			}
		} else {
			$selectedFormat = undefined;
		}
	}

	// Clear any selected filter values when an outlet has been selected (in search box)
	$: if ($selectedFormat === undefined) {
		value = undefined; // Clears selected value in dropdown
	}

	// Reset markers when filter value has been selected (and $selectedOutlet is undefined)
	$: if ($selectedOutlet === undefined) {
		$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
		$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
	}

	// Retain filter selections when clicking away to other tabs and returning to filters
	$: if ($selectedFormat && value === undefined) {
		justValue = $selectedFormat;
		value = justValue;
	}
</script>

<form>
	<label for="format-search" class="filter-name">
		<span class:active={$selectedFormat}>{@html formatHeader}</span>
	</label>
	<Select
		id="format-search"
		items={formatList}
		placeholder="Select format"
		multiple
		closeListOnChange={false}
		bind:value
		bind:justValue
		on:change={() => {
			$selectedOutlet ? ($selectedOutlet = undefined) : null;
			$selectedFormat = value.map((d) => d.value);
			$popup?.remove();
		}}
		on:clear={handleClear}
		on:clear={() => $popup?.remove()}
	/>
</form>

<style>
	label {
		font-size: 0.8rem;
	}

	.filter-name {
		font-weight: 900;
		text-transform: uppercase;
		font-size: 0.85rem;
	}

	.active {
		color: var(--cerulean);
	}
</style>
