<script>
	// Import icon components
	// import InfoIcon from '$lib/components/icons/Info.svelte';
	// import ListIcon from '$lib/components/icons/List.svelte';

	// Import stores
	import { aboutPanelVisible, searchPanelVisible, outletPanelVisible } from '$lib/stores.js';
</script>

<div class="btn-container">
	<button
		class:active={$aboutPanelVisible}
		on:click|stopPropagation={() => {
			$aboutPanelVisible = true;
			$searchPanelVisible = false;
			$outletPanelVisible = false;
		}}>About</button
	>
	<button
		class:active={$searchPanelVisible}
		on:click|stopPropagation={() => {
			$aboutPanelVisible = false;
			$searchPanelVisible = true;
			$outletPanelVisible = false;
		}}>Search</button
	>
	<button
		class:active={$outletPanelVisible}
		on:click|stopPropagation={() => {
			$aboutPanelVisible = false;
			$searchPanelVisible = false;
			$outletPanelVisible = true;
		}}>Outlets</button
	>
</div>

<style>
	.btn-container {
		display: flex;
		border-top: 0.75px solid var(--orange);
		border-bottom: 3px solid #eee;
	}

	button {
		background-color: #fffffd;
		font-size: 1rem;
		font-weight: 600;
		text-transform: uppercase;
		padding: 7px 0;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 5px;
		flex: 1 1 0px; /* make buttons equal width */
	}

	button:not(:last-child) {
		border-right: 1px solid #eee;
	}

	.active {
		box-shadow: inset 0px -3px 0px 0px var(--green);
		font-weight: 700;
		cursor: auto;
	}
</style>
