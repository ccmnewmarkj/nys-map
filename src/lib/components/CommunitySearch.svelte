<script>
	// svelte-select for dropdown menu
	import Select from 'svelte-select';

	// Import stores
	import { selectedCommunity, filteredDirectory } from '$lib/stores.js';

	// List of formats for dropdown menu
	$: communityList = [
		...new Set(
			$filteredDirectory.features
				?.map((d) => d.properties['Community'])
				?.flatMap((d) => d)
				.sort()
		)
	];

	// Selected values in dropdown remain in place even after going to another panel
	let value;

	let communityHeader;
	$: if ($selectedCommunity) {
		if (communityList.length > 1) {
			communityHeader = `Search from <span style="color: var(--cerulean);">${communityList.length} communities</span>`;
		} else if (communityList.length === 1) {
			communityHeader = 'no additional communities available';
		}
	} else {
		communityHeader =
			communityList.length > 1
				? `Search from ${communityList.length} communities`
				: `Search from ${communityList.length} community`;
	}

	function handleClear() {
		if ($selectedCommunity.length > 1) {
			if (value === undefined) {
				$selectedCommunity = undefined;
			} else {
				$selectedCommunity = value.map((d) => d.value);
			}
		} else {
			$selectedCommunity = undefined;
		}
	}
</script>

<form>
	<label for="community-search" class="filter-name">
		<span class:active={$selectedCommunity}>{@html communityHeader}</span>
	</label>
	<Select
		id="community-search"
		items={communityList}
		placeholder="Select community"
		multiple
		closeListOnChange={false}
		bind:value
		on:change={() => ($selectedCommunity = value.map((d) => d.value))}
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
