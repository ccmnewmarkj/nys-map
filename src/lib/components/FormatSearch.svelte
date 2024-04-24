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

	let formatList;
	// List of formats for dropdown menu
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
			formatHeader = 'Clear the selection to choose another format';
		}
	} else {
		formatHeader =
			// formatList.length > 1
			// 	? `Search from ${formatList.length} formats`
			// 	: `Search from ${formatList.length} format`;
			`Search by format <span style="font-weight: 400;">(${formatList.length} total)</span>`;
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
		font-size: 0.8rem;
	}

	.filter-name {
		font-weight: 800;
		/* text-transform: uppercase; */
		font-size: 0.85rem;
	}
</style>
