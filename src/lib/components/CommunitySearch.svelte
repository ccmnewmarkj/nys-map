<script>
	// svelte-select for dropdown menu
	import Select from 'svelte-select';

	// Import stores
	import { map, selectedCommunity, filteredDirectory, selectedOutlet, popup } from '$lib/stores.js';

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
	let justValue;

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

	// Clear $selectedCommunity values when clear button is selected
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

	// Clear any selected filter values when an outlet has been selected (in search box)
	$: if ($selectedCommunity === undefined) {
		value = undefined; // Clears selected value in dropdown
	}

	// Reset markers when filter value has been selected (and $selectedOutlet is undefined)
	$: if ($selectedOutlet === undefined) {
		$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
		$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
	}

	// Retain filter selections when clicking away to other tabs and returning to filters
	$: if ($selectedCommunity && value === undefined) {
		justValue = $selectedCommunity;
		value = justValue;
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
		on:change={() => {
			$selectedOutlet ? ($selectedOutlet = undefined) : null;
			$selectedCommunity = value.map((d) => d.value);
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
