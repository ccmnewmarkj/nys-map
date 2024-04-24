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
	import {
		directoryData,
		filteredDirectory,
		aboutPanelVisible,
		searchPanelVisible,
		outletPanelVisible
	} from '$lib/stores.js';

	// Import transition
	import { fade } from 'svelte/transition';

	// Set state of sidebar
	export let sidebarVisible;

	// Outlet count
	$: outletCount = $filteredDirectory.features?.length;
</script>

<header>
	<h1>NYS Media Map</h1>
	<p style="font-size: 0.85rem;">
		A project of the <a
			href="https://www.journalism.cuny.edu/centers/center-community-media/advertising-boost-initiative/"
			>Advertising Boost Initiative</a
		> at the Center for Community Media
	</p>
</header>

<nav>
	<PanelBtns badgeCount={outletCount} />
</nav>

{#if $aboutPanelVisible}
	<main class="panel-body" in:fade>
		<AboutPanel {outletCount} />
	</main>
{:else if $searchPanelVisible}
	<main class="panel-body" in:fade>
		<SearchPanel />
	</main>
{:else if $outletPanelVisible}
	<main class="panel-body" in:fade>
		<OutletPanel {outletCount} />
	</main>
{/if}

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
		max-height: calc(100vh - 4rem);
		max-height: calc(100svh - 4rem);
		display: flex;
		flex-direction: column;
		overflow: auto;
		scrollbar-gutter: stable;
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

	header {
		padding: 1rem 1rem 0.5rem 1rem;

		/* Source: https://uigradients.com */
		background: #f8b500; /* fallback for old browsers */
		background: -webkit-linear-gradient(
			to bottom,
			#f8b500,
			#f9f07a
		); /* Chrome 10-25, Safari 5.1-6 */
		background: linear-gradient(
			to bottom,
			#f8b500,
			#f9f07a
		); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

		background: linear-gradient(180deg, rgba(91, 188, 255, 0.75) 5%, rgb(255, 241, 188) 90%);

		background: linear-gradient(180deg, rgba(55, 140, 231, 0.5) 10%, rgb(255, 241, 188) 90%);

		background: linear-gradient(180deg, rgba(59, 188, 241, 0.5) 10%, rgb(255, 241, 188) 90%);
	}
</style>
