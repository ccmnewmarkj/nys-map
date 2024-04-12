<script>
	// svelte-select for dropdown menu
	import Select from 'svelte-select';

	// Import stores
	import {
		selectedLanguage,
		selectedCommunity,
		directoryData,
		filteredDirectory
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
	let value;

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
		on:change={() => ($selectedLanguage = value.map((d) => d.value))}
		on:clear={handleClear}
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
