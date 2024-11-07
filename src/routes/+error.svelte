<script>
	import { page } from '$app/stores';

	// ABI logo
	import ccmABILogo from '$lib/images/CCM+TheAdvertisingBoostInitiative.png';

	// Import icon components
	import LeftArrow from '$lib/components/icons/LeftArrow.svelte';

	// Check if on main page
	const isMainPage = $page.url.pathname === '/';
</script>

<div class="page-container">
	<div class="text-container">
		<a
			href="https://www.journalism.cuny.edu/centers/center-community-media/advertising-boost-initiative/"
			><img
				src={ccmABILogo}
				alt="Center for Community's Advertising Boost Initiative logo"
				width="375"
				height="auto"
			/></a
		>

		<p class="error-number">404</p>
		<p class="error-msg">{$page.error.message}</p>
		<p style="font-size: 0.9rem;">
			Please report the error to <a href="mailto:ccm@journalism.cuny.edu">ccm@journalism.cuny.edu</a
			>.
		</p>
		<hr />
		<p class="goto-link">
			{#if isMainPage}
				<!-- if main map page -->
				<LeftArrow />
				Go to the
				<a
					href="https://www.journalism.cuny.edu/centers/center-community-media/advertising-boost-initiative/"
					>Advertising Boost Initiative</a
				>
				or
				<a href="https://www.journalism.cuny.edu/centers/center-community-media/"
					>Center for Community Media</a
				>
			{:else}
				<!-- if path added to domain -->
				<LeftArrow />
				Go to the
				<a href="/">New York State Media Map</a>
			{/if}
		</p>
	</div>
</div>

<style>
	.page-container {
		height: 90vh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.text-container {
		padding-top: 1rem;
		text-align: center;
	}

	.error-number {
		margin-top: 1rem;
		font-size: 3rem;
		font-weight: 600;
		color: #ff8200;
	}

	.error-msg {
		font-size: 1.15rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	hr {
		margin: 1rem 0;
	}

	.goto-link {
		display: flex;
		justify-content: center;
		align-items: end;
		gap: 5px;
	}
</style>
