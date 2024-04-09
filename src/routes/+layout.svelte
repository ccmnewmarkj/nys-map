<script>
	// Import stylesheet
	import '../app.css';

	//import { map, data } from '$lib/stores.js';

	// Create promise that resolves when map and data have loaded
	//let dataLoaded = Promise.all([$map, $data]);
</script>

<svelte:head>
	<title>New York State Media Map | Center for Community Media</title>
	<!-- <meta property="og:title" content="New York State Media Map" />
	<meta property="og:description" content="Interactive map of New York State media outlets" />
	<meta property="og:url" content="" />
	<meta property="og:image" content="" />
	<meta property="og:site_name" content="New York State Media Map" />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="NYS Media Map" />
	<meta name="twitter:description" content="Interactive map of New York State media outlets" />
	<meta name="twitter:site" content="" />
	<meta name="twitter:image" content="" />
	<meta name="twitter:creator" content="" /> -->
</svelte:head>

<!-- {#await dataLoaded}
	<div class="page-container">
		<div class="text-container">Loading...</div>
	</div>
{:then}
	<slot />
{/await} -->

<slot />

<!-- <style>
	.page-container {
		display: block;
		height: 100vh;
	}
	.text-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 80vh;
	}
</style> -->
