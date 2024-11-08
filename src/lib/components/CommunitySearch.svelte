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
	const communityIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="#686D76"><path d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg>
`;

	$: communityHeader = $selectedCommunity
		? communityList.length > 1
			? communityList.length - value.length === 0
				? `<span class="filter-field-label" style="color: var(--gray);">${communityIcon} No additional communities available</span>`
				: `
					<span class="filter-field-label">${communityIcon} Search by community <span style="font-weight: 400;">(${communityList.length - value.length} more)</span></span>
					<p class="filter-field-description">Selecting more than 1 community will show outlets that serve all of those communities.</p>
				  `
			: `<span class="filter-field-label" style="color: var(--gray);">${communityIcon} No additional communities available</span>`
		: `<span class="filter-field-label">${communityIcon} Search by community <span style="font-weight: 400;">(${communityList.length} total)</span></span>`;

	// Clear/reset selected filter when outlet is selected
	$: if ($selectedOutlet) {
		value ? (value = undefined) : null; // clear selected value in filter when outlet is selected
		$filteredDirectory = $directoryData; // reset filter options
	}

	// For opened dropdown menu to appear on top of other elements
	let floatingConfig = {
		strategy: 'fixed'
	};
</script>

<form>
	<label for="community-search" class="filter-name">
		<span class:active={$selectedCommunity}>
			{@html communityHeader}
		</span>
	</label>
	<Select
		{floatingConfig}
		--list-position="fixed"
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
		font-family: 'Roboto Condensed', sans-serif;
		text-transform: uppercase;
	}

	.filter-name {
		font-weight: 800;
		/* text-transform: uppercase; */
		font-size: 0.85rem;
	}
</style>
