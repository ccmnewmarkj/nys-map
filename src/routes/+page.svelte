<script>
	// Import components
	import Map from '$lib/components/Map.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';

	// Import icon components
	import ListIcon from '$lib/components/icons/List.svelte';

	// Import transition
	import { fade } from 'svelte/transition';

	// Set state of sidebar
	let sidebarVisible = true;
</script>

<Map bind:sidebarVisible />

{#if sidebarVisible}
	<div class="sidebar-content" transition:fade={{ duration: 300 }}>
		<Sidebar bind:sidebarVisible>
			<header>
				<h1>New York State Media Outlets</h1>
			</header>
		</Sidebar>
	</div>
{:else}
	<button
		aria-label="Show sidebar"
		class="sidebar-collapsed"
		on:click|stopPropagation={() => (sidebarVisible = !sidebarVisible)}
	>
		<ListIcon />
	</button>
{/if}

<style>
	.sidebar-content {
		position: relative;
		max-width: 375px;
		max-height: calc(100svh - 4rem);
		border-radius: 5px;
		background-color: rgba(23, 23, 23, 0.75);
		top: 0;
		z-index: 1;
		margin: 1rem;
		box-shadow: 0px 0px 24px 3px rgba(255, 255, 255, 0.2);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		z-index: 2;
	}

	.sidebar-collapsed {
		position: absolute;
		top: 0;
		margin: 1rem;
		cursor: pointer;
		background-color: transparent;
		border: 0;
	}
</style>
