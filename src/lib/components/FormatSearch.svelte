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
	const formatIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#686D76"><path d="M160-80q-17 0-28.5-11.5T120-120v-558q0-15 6-25.5t20-16.5l400-160q20-8 37 5.5t17 34.5v120h40q17 0 28.5 11.5T680-680v120h-80v-80H200v480h207l80 80H160Zm200-640h160v-62l-160 62ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm-50-100 160-100-160-100v200Zm-430 20v-480 480Z"/></svg>`;

	$: formatHeader = $selectedFormat
		? `<span class="filter-field-label" style="color: var(--gray);">
					${formatIcon} 
					No additional formats can be selected
				</span>
				<p class="filter-field-description">
					Only 1 format can be chosen at a time. To choose another one, remove the selection.
				</p>`
		: `<span class="filter-field-label">${formatIcon} Search by primary format <span style="font-weight: 400;">(${formatList.length} total)</span></span>`;

	// $: formatHeader = $selectedFormat
	// 	? formatList.length > 1
	// 		? `<span class="filter-field-label">${formatIcon} Search from ${formatList.length} formats</span>`
	// 		: `<span class="filter-field-label" style="color: var(--gray);">
	// 				${formatIcon} No additional formats can be selected
	// 			</span>
	// 			<p class="filter-field-description">
	// 				Remove the selection to choose another format.
	// 			</p>`
	// 	: `<span class="filter-field-label">${formatIcon} Search by primary format <span style="font-weight: 400;">(${formatList.length} total)</span></span>`;

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
		font-size: 0.85rem;
	}
</style>
