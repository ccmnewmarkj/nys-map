<script>
	// svelte-select for dropdown menu
	import Select from 'svelte-select';

	// Import stores
	import {
		map,
		selectedLanguage,
		directoryData,
		filteredDirectory,
		selectedOutlet,
		popup
	} from '$lib/stores.js';

	// List of formats for dropdown menu
	$: languageList = [
		...new Set(
			$filteredDirectory.features
				?.map((d) => d.properties['Language'])
				?.flatMap((d) => d) // to break apart ["Spanish", "English"] and retain both values
				.sort()
		)
	];

	// Selected values in dropdown remain in place even after going to another panel
	let value = $selectedLanguage;

	// Text above filter dropdown
	let languageHeader;
	$: if ($selectedLanguage) {
		if (languageList.length > 1) {
			if (languageList.length - value.length === 0) {
				languageHeader = `<span style="color: var(--gray);">No additional languages available</span>`;
			} else {
				languageHeader = `
			Search by ${languageList.length - 1} more ${languageList.length - 1 > 1 ? 'languages' : 'language'}
			<span style="font-family: 'DM Sans', sans-serif; text-transform: none; display: block; font-weight: 400; font-size: 0.8rem; color: var(--gray);">Searching by more than one language will show only outlets with content in all selected languages, not outlets in just one of the languages.</span>
			`;
			}
		} else if (languageList.length === 1) {
			languageHeader = `<span style="color: var(--gray);">No additional languages available</span>`;
		}
	} else {
		languageHeader =
			// languageList.length > 1
			// 	? `Search from ${languageList.length} languages`
			// 	: `Search from ${languageList.length} language`;
			`
			Search by language <span style="font-weight: 400;">(${languageList.length} total)</span>
			`;
	}

	// Clear/reset selected filter when outlet is selected
	$: if ($selectedOutlet) {
		value ? (value = undefined) : null; // clear selected value in filter when outlet is selected
		$filteredDirectory = $directoryData; // reset filter options
	}
</script>

<form>
	<label for="language-search" class="filter-name"
		><span class:active={$selectedLanguage}>{@html languageHeader}</span></label
	>
	<Select
		id="language-search"
		items={languageList}
		placeholder="Select language"
		multiple
		clearable={false}
		bind:value
		on:focus={() => {
			$selectedOutlet ? ($selectedOutlet = undefined) : null;
			$popup?.remove();
			$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
			$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
		}}
		on:change={() => {
			$selectedLanguage = value.map((d) => d.value);
		}}
		on:clear={() => {
			$popup?.remove();
			if (value === undefined) {
				$selectedLanguage = undefined;
				$filteredDirectory = $directoryData;
			} else {
				$selectedLanguage = value.map((d) => d.value);
			}
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
