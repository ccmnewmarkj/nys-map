<script>
	// Import components
	import FormatSearch from '$lib/components/FormatSearch.svelte';
	import CommunitySearch from '$lib/components/CommunitySearch.svelte';
	import LanguageSearch from '$lib/components/LanguageSearch.svelte';
	import OutletSearch from '$lib/components/OutletSearch.svelte';

	// Import stores
	import {
		map,
		directoryData,
		filteredDirectory,
		selectedFormat,
		selectedCommunity,
		selectedLanguage
	} from '$lib/stores.js';

	// Filter data (filter dropdown selections, map markers, outlet list tab) based on selections from multiple dropdowns
	$: {
		if ($selectedFormat || $selectedCommunity || $selectedLanguage) {
			$filteredDirectory = {
				type: 'FeatureCollection',
				features: $directoryData.features?.filter((d) => {
					let formatState = !$selectedFormat || $selectedFormat === d.properties['Primary Format'];

					let communityState =
						!$selectedCommunity ||
						$selectedCommunity?.every((community) => d.properties['Community'].includes(community));

					let languageState =
						!$selectedLanguage ||
						$selectedLanguage?.every((language) => d.properties['Language'].includes(language));

					return formatState && communityState && languageState;
				})
			};
			// Update points on map
			$map.getSource('outlets').setData($filteredDirectory);
		} else {
			// Reset filtered data source
			$map.getSource('outlets').setData($directoryData);
		}
	}
</script>

<!-- Intro -->
<section id="search-filters" aria-labelledby="search-btn">
	<p style="font-size: 0.85rem;">
		Select options from one or more of the three filters to narrow down your search. Once you make a
		selection, the three filters will only show the remaining options based on the option(s) you
		have chosen.
	</p>

	<!-- Filters -->

	<!-- Filter by format -->
	<div class="filter">
		<FormatSearch />
	</div>

	<!-- Filter by community -->
	<div class="filter">
		<CommunitySearch />
	</div>

	<!-- Filter by language -->
	<div class="filter">
		<LanguageSearch />
	</div>

	<hr />

	<!-- Outlet search -->
	<div class="filter">
		<OutletSearch />
	</div>
</section>

<style>
	p:not(:first-of-type) {
		margin-top: 1rem;
	}

	.filter {
		margin-top: 1rem;
		margin-bottom: 0.5rem;
	}

	hr {
		/* margin-top: 1.5rem; */
		width: 90%;
		margin-left: auto;
		margin-right: auto;
		border-top: 0.5px solid rgba(0, 0, 0, 0.2);
	}

	/* details > summary {
		font-size: 0.8rem;
		background-color: var(--alice-blue-light);
		cursor: pointer;
		padding: 0.5rem 0rem 0.5rem 0.5rem;
	} */

	/* two "cols" with arrow and text: https://stackoverflow.com/questions/51131818/how-to-vertically-align-detailss-arrow-with-summarys-content */
	/* summary > p {
		display: inline-block;
		width: calc(100% - 50px);
		vertical-align: top;
		margin-left: 3px;
	}

	details > .content p {
		padding: 0.25rem 0;
	}

	details[open] > summary {
		background-color: var(--light-gray);
		background-color: rgba(216, 224, 232, 0.5);
	}

	details[open] > .content {
		border-top: 1px solid var(--alice-blue);
		border-bottom: 1px solid var(--alice-blue);
		font-size: 0.75rem;
		background-color: rgba(216, 224, 232, 0.15);
		padding: 0 10px;
	} */
</style>
