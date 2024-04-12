<script>
	// Import icon components
	// import InfoIcon from '$lib/components/icons/Info.svelte';
	// import ListIcon from '$lib/components/icons/List.svelte';

	// Import stores
	import { aboutPanelVisible, searchPanelVisible, outletPanelVisible } from '$lib/stores.js';

	export let badgeCount = '';
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
		}}
		>Outlets {#if badgeCount}
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
		flex: 1 1 0px; /* make buttons equal width */
	}

	button:not(:last-child) {
		border-right: 1px solid #fffffd;
	}

	.active {
		/* box-shadow: inset 0px -1px 0px 0px rgba(248, 181, 0, 1); */
		background-color: var(--white);
		font-weight: 700;
		cursor: auto;
	}

	.badge-count {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0.1rem 0.4rem;
		margin-left: 0.2rem;
		font-family: 'Open Sans', sans-serif;
		font-size: 0.7rem;
		font-weight: 700;
		line-height: 1.4;
		color: var(--white);
		text-align: center;
		background-color: var(--cerulean);
		border-radius: 10px;
	}
</style>
