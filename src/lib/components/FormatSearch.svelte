<script>
	// svelte-select for dropdown menu
	import Select from 'svelte-select';

	// Import stores
	import {
		map,
		selectedFormat,
		selectedCommunity,
		selectedLanguage,
		directoryData,
		filteredDirectory,
		selectedOutlet,
		popup
	} from '$lib/stores.js';

	// List of formats for dropdown menu:
	// Show all options when no other filter is applied
	let formatList;
	$: if (!$selectedCommunity && !$selectedLanguage) {
		formatList = [
			...new Set(
				$directoryData.features
					?.map((d) => d.properties['Primary Format'])
					?.flatMap((d) => d)
					.sort()
			)
		];
	} else {
		formatList = [
			...new Set(
				$filteredDirectory.features
					?.map((d) => d.properties['Primary Format'])
					?.flatMap((d) => d)
					.sort()
			)
		];
	}

	// Selected values in dropdown remain in place even after going to another panel
	let value = $selectedFormat;

	// Text above filter dropdown
	let formatHeader;
	$: if ($selectedFormat) {
		if (formatList.length > 1) {
			formatHeader = `Search from ${formatList.length} formats`;
		} else if (formatList.length === 1) {
			formatHeader = `<span style="font-family: 'DM Sans', sans-serif; text-transform: none; display: block; font-weight: 400; font-size: 0.8rem; color: var(--gray);">Clear the selection to choose another format</span>`;
		}
	} else {
		formatHeader =
			// formatList.length > 1
			// 	? `Search from ${formatList.length} formats`
			// 	: `Search from ${formatList.length} format`;
			`Search by primary format <span style="font-weight: 400;">(${formatList.length} total)</span>`;
	}

	// Clear/reset selected filter when outlet is selected
	$: if ($selectedOutlet) {
		value ? (value = undefined) : null; // clear selected value in filter when outlet is selected
		$filteredDirectory = $directoryData; // reset filter options
	}
</script>

<form>
	<label for="format-search" class="filter-name">
		<span class:active={$selectedFormat}>{@html formatHeader}</span>
	</label>
	<Select
		id="format-search"
		items={formatList}
		placeholder="Select primary format"
		bind:value
		on:focus={() => {
			$selectedOutlet ? ($selectedOutlet = undefined) : null;
			$popup?.remove();
			$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
			$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
		}}
		on:change={() => {
			$selectedFormat = value.value;
		}}
		on:clear={() => {
			$popup?.remove();
			$selectedFormat = undefined;
			$filteredDirectory = $directoryData;
		}}
	/>
</form>

<style>
	label {
		font-family: 'Roboto Condensed', sans-serif;
		text-transform: uppercase;
	}

	.filter-name {
		font-weight: 800;
		/* text-transform: uppercase; */
		font-size: 0.85rem;
	}
</style>
