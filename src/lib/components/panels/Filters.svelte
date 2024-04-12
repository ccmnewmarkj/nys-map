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
				return $selectedFormat.every((format) => d.properties['Format'].includes(format));
			})
		};
	} else if ($selectedFormat && $selectedCommunity && $selectedLanguage === undefined) {
		$filteredDirectory = {
			type: 'FeatureCollection',
			features: $directoryData.features?.filter((d) => {
				return (
					$selectedFormat.every((format) => d.properties['Format'].includes(format)) &&
					$selectedCommunity.every((community) => d.properties['Community'].includes(community))
				);
			})
		};
	} else if ($selectedFormat && $selectedCommunity === undefined && $selectedLanguage) {
		$filteredDirectory = {
			type: 'FeatureCollection',
			features: $directoryData.features?.filter((d) => {
				return (
					$selectedFormat.every((format) => d.properties['Format'].includes(format)) &&
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
					$selectedFormat.every((format) => d.properties['Format'].includes(format)) &&
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
<p>
	Apply one or more of the three filters to narrow down your search. Applying a filter will adjust
	the values of the other two to the remaining options.
</p>

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

<p class="callout">
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
</style>
