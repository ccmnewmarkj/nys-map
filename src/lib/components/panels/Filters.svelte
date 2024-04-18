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

	// Filter data based on selections from multiple dropdown
	$: if ($selectedFormat && $selectedCommunity === undefined && $selectedLanguage === undefined) {
		$filteredDirectory = {
			type: 'FeatureCollection',
			features: $directoryData.features?.filter((d) => {
				return $selectedFormat.every((format) => d.properties['Primary Format'].includes(format));
			})
		};
	} else if ($selectedFormat && $selectedCommunity && $selectedLanguage === undefined) {
		$filteredDirectory = {
			type: 'FeatureCollection',
			features: $directoryData.features?.filter((d) => {
				return (
					$selectedFormat.every((format) => d.properties['Primary Format'].includes(format)) &&
					$selectedCommunity.every((community) => d.properties['Community'].includes(community))
				);
			})
		};
	} else if ($selectedFormat && $selectedCommunity === undefined && $selectedLanguage) {
		$filteredDirectory = {
			type: 'FeatureCollection',
			features: $directoryData.features?.filter((d) => {
				return (
					$selectedFormat.every((format) => d.properties['Primary Format'].includes(format)) &&
					$selectedLanguage.every((language) => d.properties['Language'].includes(language))
				);
			})
		};
	} else if (
		$selectedFormat === undefined &&
		$selectedCommunity &&
		$selectedLanguage === undefined
	) {
		$filteredDirectory = {
			type: 'FeatureCollection',
			features: $directoryData.features?.filter((d) => {
				return $selectedCommunity.every((community) =>
					d.properties['Community'].includes(community)
				);
			})
		};
	} else if ($selectedFormat === undefined && $selectedCommunity && $selectedLanguage) {
		$filteredDirectory = {
			type: 'FeatureCollection',
			features: $directoryData.features?.filter((d) => {
				return (
					$selectedCommunity.every((community) => d.properties['Community'].includes(community)) &&
					$selectedLanguage.every((language) => d.properties['Language'].includes(language))
				);
			})
		};
	} else if (
		$selectedFormat === undefined &&
		$selectedCommunity === undefined &&
		$selectedLanguage
	) {
		$filteredDirectory = {
			type: 'FeatureCollection',
			features: $directoryData.features?.filter((d) => {
				return $selectedLanguage.every((language) => d.properties['Language'].includes(language));
			})
		};
	} else if ($selectedFormat && $selectedCommunity && $selectedLanguage) {
		$filteredDirectory = {
			type: 'FeatureCollection',
			features: $directoryData.features?.filter((d) => {
				return (
					$selectedFormat.every((format) => d.properties['Primary Format'].includes(format)) &&
					$selectedCommunity.every((community) => d.properties['Community'].includes(community)) &&
					$selectedLanguage.every((language) => d.properties['Language'].includes(language))
				);
			})
		};
	} else {
		$filteredDirectory = $directoryData;
	}

	// Update points on map
	$: if ($selectedFormat || $selectedCommunity || $selectedLanguage) {
		$map.getSource('outlets').setData($filteredDirectory);
	} else if (
		!$selectedFormat?.length &&
		!$selectedCommunity?.length &&
		!$selectedLanguage?.length
	) {
		$map.getSource('outlets').setData($directoryData);
	}
</script>

<!-- Intro -->
<p>Apply one or more of the three filters to narrow down your search.</p>
<details>
	<summary style="font-size: 0.85rem;"
		>Selecting a value will modify the filters to the remaining options.</summary
	>
	<div class="content">
		<p style="font-size: 0.8rem; margin-top: 0.25rem;">
			For example, if you select "Black" as the community:
		</p>
		<ul style="font-size: 0.8rem;">
			<li>
				You will only be able to additionally select "Latino" from the filter because only that
				combination is found among outlets in the directory that serve the Black community.
			</li>
			<li>
				Likewise, the format and language filters will only show options found among Black media
				outlets.
			</li>
		</ul>
	</div>
</details>

<!-- Filters -->
<section>
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
</section>

<p style="font-size: 0.8rem;">
	<strong>Note:</strong> If you select multiple values from a dropdown, the search will return only outlets
	for which all selected values are true. For example, if you select both "Spanish" and "English" from
	the language dropdown, you will only get outlets that have content in both languages, not outlets in
	just Spanish or English.
</p>

<!-- Outlet search -->
{#if $directoryData}
	<div class="filter">
		<OutletSearch data={$directoryData} />
	</div>
{/if}

<style>
	p:not(:first-of-type) {
		margin-top: 1rem;
	}

	.filter {
		margin-top: 1rem;
	}

	details {
		box-sizing: border-box;
		background: rgba(254, 241, 188, 0.05);
	}

	details > summary {
		padding: 0.5rem;
		display: block;
		background: var(--light-yellow);
		padding-left: 1.6rem;
		position: relative;
		cursor: pointer;
	}

	details[open] > summary:before {
		transform: rotate(90deg);
	}

	/* arrow */
	details > summary:before {
		content: '';
		border-width: 5.5px;
		border-style: solid;
		border-color: transparent transparent transparent var(--yellow-orange);
		position: absolute;
		top: 0.65rem;
		left: 0.75rem;
		transform: rotate(0);
		transform-origin: 0.2rem 50%;
		transition: 0.25s transform ease;
	}

	details > .content {
		font-size: 0.85rem;
		padding: 0.25rem 0.75rem;
	}
</style>
