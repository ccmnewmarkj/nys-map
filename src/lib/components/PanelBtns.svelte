<script>
	// Import icon components
	import InfoIcon from '$lib/components/icons/InfoCircle.svelte';
	import SearchIcon from '$lib/components/icons/Search.svelte';
	import ListIcon from '$lib/components/icons/List.svelte';

	// Import stores
	import {
		map,
		popup,
		aboutPanelVisible,
		searchPanelVisible,
		outletPanelVisible,
		selectedOutlet
	} from '$lib/stores.js';

	export let badgeCount = '';
</script>

<div class="btn-container">
	<!-- About -->
	<button
		id="about-btn"
		class:active={$aboutPanelVisible}
		on:click|stopPropagation={() => {
			$aboutPanelVisible = true;
			$searchPanelVisible = false;
			$outletPanelVisible = false;
			if ($selectedOutlet) {
				$selectedOutlet = undefined;
				$popup?.remove();
				$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
				$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
			}
		}}><InfoIcon />About</button
	>

	<!-- Search -->
	<button
		id="search-btn"
		class:active={$searchPanelVisible}
		on:click|stopPropagation={() => {
			$aboutPanelVisible = false;
			$searchPanelVisible = true;
			$outletPanelVisible = false;
			if ($selectedOutlet) {
				$selectedOutlet = undefined;
				$popup?.remove();
				$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
				$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
			}
		}}><SearchIcon />Search</button
	>

	<!-- Outlets -->
	<button
		id="outlet-btn"
		class:active={$outletPanelVisible}
		on:click|stopPropagation={() => {
			$aboutPanelVisible = false;
			$searchPanelVisible = false;
			$outletPanelVisible = true;
			if ($selectedOutlet) {
				$selectedOutlet = undefined;
				$popup?.remove();
				$map.setPaintProperty('outlet-layer', 'circle-opacity', 1);
				$map.setFilter('outlet-search-layer', ['in', 'Media Outlet', '']);
			}
		}}
		><ListIcon />Outlets {#if badgeCount}
			<span class="badge-count">{badgeCount}</span>
		{/if}</button
	>
</div>

<style>
	.btn-container {
		display: flex;
		border-top: 1px solid rgba(248, 181, 0, 0.5);
		border-bottom: 2px solid rgba(248, 181, 0, 0.45);
	}

	button {
		background-color: var(--light-gray);
		font-size: 1rem;
		font-weight: 600;
		text-transform: uppercase;
		padding: 7px 0;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 5px;
		flex: 1; /* make buttons equal width */
	}

	button:last-child {
		flex: 1.2; /* make the last button slightly larger */
	}

	button:not(:last-child) {
		border-right: 1px solid #fffffd;
	}

	.active {
		background-color: var(--white);
		cursor: auto;
	}

	.badge-count {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.1rem 0.35rem;
		margin-left: 0.1rem;
		font-size: 0.75rem;
		line-height: 1.4;
		color: var(--white);
		text-align: center;
		background-color: var(--cerulean);
		border-radius: 10px;
	}
</style>
