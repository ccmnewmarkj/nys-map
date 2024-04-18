<script>
	// svelte-select for dropdown menu
	import Select from 'svelte-select';

	// Import stores
	import { map, selectedLanguage, filteredDirectory, selectedOutlet, popup } from '$lib/stores.js';

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
	let value;
	let justValue;

	let languageHeader;
	$: if ($selectedLanguage) {
		if (languageList.length > 1) {
			languageHeader = `Search from <span style="color: var(--cerulean);">${languageList.length} languages</span>`;
		} else if (languageList.length === 1) {
			languageHeader = 'no additional languages available';
		}
	} else {
		languageHeader =
			languageList.length > 1
				? `Search from ${languageList.length} languages`
				: `Search from ${languageList.length} language`;
	}

	// Clear $selectedLanguage values when clear button is selected
	function handleClear() {
		if ($selectedLanguage.length > 1) {
			if (value === undefined) {
				$selectedLanguage = undefined;
			} else {
				$selectedLanguage = value.map((d) => d.value);
			}
		} else {
			$selectedLanguage = undefined;
		}
	}

	// Clear any selected filter values when an outlet has been selected (in search box)
	$: if ($selectedLanguage === undefined) {
		value = undefined; // Clears selected value in dropdown
	}

	// Reset markers when filter value has been selected (and $selectedOutlet is undefined)
	$: if ($selectedOutlet === undefined) {
		$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
		$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
	}

	// Retain filter selections when clicking away to other tabs and returning to filters
	$: if ($selectedLanguage && value === undefined) {
		justValue = $selectedLanguage;
		value = justValue;
	}
</script>

<form>
	<label for="language-search" class="filter-name">{@html languageHeader}</label>
	<Select
		id="language-search"
		items={languageList}
		placeholder="Select language"
		multiple
		closeListOnChange={false}
		bind:value
		on:change={() => {
			$selectedOutlet ? ($selectedOutlet = undefined) : null;
			$selectedLanguage = value.map((d) => d.value);
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
</style>
