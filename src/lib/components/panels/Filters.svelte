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
<p>Apply one or more of the three filters to narrow down your search.</p>

<!-- Notes -->
<section>
	<details>
		<summary
			><p>
				Selecting an option from a filter will modify all three filters to show only the remaining
				options.
			</p></summary
		>

		<div class="content">
			<p>For example, if you select "Black" as the community:</p>
			<ul>
				<li>
					You will only be able to additionally select "Latino" from the comminity filter because
					just that combination is found among outlets in the directory that serve the Black
					community.
				</li>
				<li>
					Likewise, the format and language filters will only show options found among Black media
					outlets. Or, if "Latino" is also selected, those two filters will show options for only
					the outlets that serve both two communities.
				</li>
			</ul>
		</div>
	</details>

	<!-- <details>
		<summary
			><p>
				Selecting multiple options from a filter will return only outlets for which all selected
				values apply.
			</p>
		</summary>
		<div class="content">
			<p>
				For example, if you select both "Spanish" and "English" from the language dropdown, you will
				only get outlets that have content in both languages, not outlets in just Spanish or
				English.
			</p>
		</div>
	</details> -->
</section>

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

<!-- Outlet search -->

<div class="filter">
	<OutletSearch />
</div>

<style>
	p:not(:first-of-type) {
		margin-top: 1rem;
	}

	.filter {
		margin-top: 1rem;
	}

	details:first-child {
		margin-top: 0.5rem;
	}

	details > summary {
		font-size: 0.85rem;
		/* background-color: var(--white-blue); */
		background-color: var(--alice-blue-light);
		/* border-top: 1px solid var(--silver); */
		/* border-bottom: 1px solid var(--alice-blue); */
		cursor: pointer;
		padding: 0.25rem 0rem 0.25rem 0.5rem;
	}

	/* two "cols" with arrow and text: https://stackoverflow.com/questions/51131818/how-to-vertically-align-detailss-arrow-with-summarys-content */
	summary > p {
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
		font-size: 0.8rem;
	}

	/* details > summary {
		padding: 0.5rem;
		display: block;
		background: var(--light-yellow);
		padding-left: 1.6rem;
		position: relative;
		cursor: pointer;
	}

	details[open] > summary:before {
		transform: rotate(90deg);
	} */

	/* arrow */
	/* details > summary:before {
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
		background: #f6f5f2;
	} */
</style>
