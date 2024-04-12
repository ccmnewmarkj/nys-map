<script>
	// svelte-select for dropdown menu
	import Select from 'svelte-select';

	// Import stores
	import { selectedFormat, filteredDirectory } from '$lib/stores.js';

	// List of formats for dropdown menu
	$: formatList = [
		...new Set(
			$filteredDirectory.features
				?.map((d) => d.properties['Format'])
				?.flatMap((d) => d)
				.sort()
		)
	];

	// Selected values in dropdown remain in place even after going to another panel
	let value;

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

	function handleClear() {
		if ($selectedFormat.length > 1) {
			if (value === undefined) {
				$selectedFormat = undefined;
			} else {
				$selectedFormat = value.map((d) => d.value);
			}
		} else {
			$selectedFormat = undefined;
		}
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
		on:change={() => ($selectedFormat = value.map((d) => d.value))}
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

	.active {
		color: var(--cerulean);
	}
</style>
