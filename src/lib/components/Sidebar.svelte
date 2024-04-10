<script>
	// Import components
	import PanelBtns from '$lib/components/PanelBtns.svelte';
	// panels
	import AboutPanel from '$lib/components/panels/About.svelte';
	import SearchPanel from '$lib/components/panels/Filters.svelte';
	import OutletPanel from '$lib/components/panels/Outlets.svelte';

	// Import icon components
	import CloseIcon from '$lib/components/icons/CloseCircle.svelte';

	// Import stores
	import { aboutPanelVisible, searchPanelVisible, outletPanelVisible } from '$lib/stores.js';

	// Import transition
	import { fade } from 'svelte/transition';

	// Set state of sidebar
	export let sidebarVisible;
</script>

<header>
	<h1>NYS Media Map</h1>
	<PanelBtns />
</header>

<main>
	{#if $aboutPanelVisible}
		<div class="panel-body" in:fade>
			<AboutPanel />
		</div>
	{:else if $searchPanelVisible}
		<div class="panel-body" in:fade>
			<SearchPanel />
		</div>
	{:else if $outletPanelVisible}
		<div class="panel-body" in:fade>
			<OutletPanel />
		</div>
	{/if}
</main>

<!-- Close button -->
<button
	class="close-button"
	aria-label="Close"
	on:click|stopPropagation={() => {
		sidebarVisible = false;
	}}><CloseIcon /></button
>

<style>
	.panel-body {
		padding: 1rem;
		max-height: calc(100svh - 4rem);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.close-button {
		position: absolute;
		top: 6px;
		right: 0px;
		background-color: transparent;
		border: 0;
		cursor: pointer;
		z-index: 100;
	}
</style>
