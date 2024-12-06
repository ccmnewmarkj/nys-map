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
	<h1 id="sidebar-title">New York State Media Map</h1>
	<p style="font-size: 0.85rem;">
		A project of the <strong
			><a
				style="text-decoration: none;"
				href="https://www.journalism.cuny.edu/centers/center-community-media/advertising-boost-initiative/"
				>Advertising Boost Initiative</a
			></strong
		> at the Center for Community Media
	</p>
</header>

<nav>
	<PanelBtns badgeCount={outletCount} />
</nav>

{#if $aboutPanelVisible}
	<main class="panel-body" style="padding: 0;" in:fade>
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
	aria-label="Hide sidebar"
	on:click|stopPropagation={() => {
		sidebarVisible = false;
	}}><CloseIcon /></button
>

<style>
	.close-button {
		position: absolute;
		top: 6px;
		right: 0px;
		background-color: transparent;
		border: 0;
		cursor: pointer;
		z-index: 1;
	}

	header {
		padding: 0.75rem 1rem 0.5rem 1rem;

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

		/* background: linear-gradient(180deg, rgba(91, 188, 255, 0.75) 5%, rgb(255, 241, 188) 90%);

		background: linear-gradient(180deg, rgba(55, 140, 231, 0.5) 10%, rgb(255, 241, 188) 90%); */

		background:
			url("data:image/svg+xml,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 84.16 64'%3E%3Cdefs%3E%3Cstyle%3E .cls-1 %7B fill: rgba(115, 144, 114, 0.25); %7D %3C/style%3E%3C/defs%3E%3Cpath class='cls-1' d='M60.48,62l-1.2.16-.72,1.84,1.92-1.2v-.8ZM69.44,61.6l-1.04.24-2.48.56,1.76-.16,1.76-.64ZM70.4,61.84l3.92-1.84-5.44,2v.16l1.52-.32ZM79.92,54.8l-1.04-.16-2.96,2.4-5.28.32-1.12.8-2-.56.4.72-.8-.72-.4.8-1.44-.08-.32,1.12-.72-.88-.16,1.04-.24-.24v.64l-1.84.16-1.28,1.84.4,1.04,1.36-.32-.24-.56.8-.32.8.56-1.84.8,3.68-.48-1.44-.32,11.6-2.96-.96.56,9.28-4.4-2.72,1.04-.72-.8-.08.56-1.44-.08-1.44,1.84h-1.84l4-3.36ZM82.48,52.96h.16l.56-.56-.96.4.24.16ZM9.92,26.8l-1.04-.48-.08.88.48.4.64-.8ZM38.08,14.08l.16-.08v-.48l-.72,1.04.56-.48ZM39.68,9.84l-.56.16-.16.24.96-.24-.24-.16ZM41.36,8.96l-1.28.4.16.64.64-.64.48-.4ZM52.32,0l-4.08,2-4.56,3.84-1.6,2.96-5.2,3.44.56,1.36.96-.64.88.4-.88,1.04,1.52-.32-1.68,2.16-.16-.72-.64.72.8,2.96.24-.24-.08,1.04-.88.96-1.6-.16-3.04,2.64-2.32.4-.32.8-4.08-.88-2.32.56-1.68-1.44-6.48-.96-7.36,1.28-.08,2.56,1.84.8-.56,1.04.4,2.8-1.68.88-1.28,1.92L.24,37.2l-.24,3.76,46.88,1.84.88,1.76,1.92.8.08,3.04.72,1.52,2.64,1.04.48.96,8.48,5.12-.8-3.84.56-.72.64,4.16-1.36,4.4.88-1.44,1.28-.16-.16-.64,1.84-1.76-.88-1.44,2.64-1.68-.8-.96.48-11.44,2.48-9.36-.24-11.36-.4-1.04-1.12.72-.16-.56.56-2.48-.8-3.92,1.12-2.56.4-2.96-.8-2.4.08-4.8v-.8h-15.2,0Z' /%3E%3C/svg%3E")
				no-repeat right 15px bottom -5px,
			linear-gradient(180deg, rgba(59, 188, 241, 0.5) 10%, rgb(255, 241, 188) 90%);
	}

	.panel-body {
		padding: 1rem;
		max-height: calc(100vh - 4rem);
		max-height: calc(100svh - 4rem);
		display: flex;
		flex-direction: column;
		overflow: auto;
		scrollbar-gutter: stable;
	}
</style>
