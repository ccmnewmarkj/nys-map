<script>
	// svelte-select for dropdown menu
	import Select from 'svelte-select';

	// Import stores
	import {
		filteredDirectory,
		selectedCommunity,
		directoryData,
		selectedOutlet,
		popup,
		map
	} from '$lib/stores.js';

	// List of communities for dropdown menu
	$: communityList = [
		...new Set(
			$filteredDirectory.features
				?.map((d) => d.properties['Community'])
				.flatMap((d) => d)
				.sort()
		)
	];

	// Selected values in dropdown remain in place even after going to another panel
	let value = $selectedCommunity;

	// Text above filter dropdown
	let communityHeader;
	$: if ($selectedCommunity) {
		if (communityList.length > 1) {
			communityHeader =
				// Search from <span style="color: var(--cerulean);">${communityList.length} communities</span>
				// If you search using more than one community, you'll only see results from outlets that have content in all of the selected communities.
				`
			Search by ${communityList.length - 1} more ${communityList.length - 1 > 1 ? 'communities' : 'community'}
			<span style="display: block; font-weight: 400; font-size: 0.8rem; color: gray;">Searching by more than one community will show outlets with content for all selected communities, not outlets that serve just one of the communities.</span>	
			`;
		} else if (communityList.length === 1) {
			communityHeader = `<span style="color: gray;">No additional communities available</span>`;
		}
	} else {
		communityHeader =
			// communityList.length > 1
			// 	? `Search from ${communityList.length} communities`
			// 	: `Search from ${communityList.length} community`;
			`Search by community <span style="font-weight: 400;">(${communityList.length} total)</span>`;
	}

	// Clear/reset selected filter when outlet is selected
	$: if ($selectedOutlet) {
		value ? (value = undefined) : null; // clear selected value in filter when outlet is selected
		$filteredDirectory = $directoryData; // reset filter options
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
		clearable={false}
		bind:value
		on:focus={() => {
			$selectedOutlet ? ($selectedOutlet = undefined) : null;
			$popup?.remove();
			$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
			$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
		}}
		on:change={() => {
			$selectedCommunity = value.map((d) => d.value);
		}}
		on:clear={() => {
			$popup?.remove();
			if (value === undefined) {
				$selectedCommunity = undefined;
				$filteredDirectory = $directoryData;
			} else {
				$selectedCommunity = value.map((d) => d.value);
			}
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
