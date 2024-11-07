<script>
	// Import stores
	import {
		map,
		filteredDirectory,
		selectedFormat,
		selectedCommunity,
		selectedLanguage,
		selectedOutlet
	} from '$lib/stores.js';

	// Import icon components
	import OpenLink from '$lib/components/icons/OpenLink.svelte';
	import MapPin from '$lib/components/icons/MapPin.svelte';
	import LeftArrow from '$lib/components/icons/LeftArrow.svelte';
	import RightArrow from '$lib/components/icons/RightArrow.svelte';
	import CloseCircle from '$lib/components/icons/CloseCircle.svelte';
	import Search from '$lib/components/icons/Search.svelte';

	export let outletCount;

	let filterMsg; // When a filter has been applied
	let searchQuery = ''; // Search through cards via outlet name

	function generateFilterMsg() {
		let msg = `Showing ${outletCount} `;

		if ($selectedFormat) {
			msg += `<span class="filter-selections">${$selectedFormat.replace('Digital only', 'Digital-only outlet').replace('Radio', 'Radio station').replace('TV', 'TV station').toLowerCase()}${outletCount > 1 ? 's' : ''}</span>`;
		} else {
			msg += `${outletCount > 1 ? 'outlets' : 'outlet'}`;
		}

		if ($selectedCommunity) {
			if ($selectedCommunity.toString() === 'Multicultural') {
				msg += ` covering <span class="filter-selections">Multicultural communitities</span>`;
			} else {
				// replace `,` with `, ` or before the last item, `and`
				const communityList = $selectedCommunity
					.toString()
					.split(',')
					.map((item) => item.trim());
				const formattedCommunityList =
					communityList.length > 1
						? communityList.slice(0, -1).join(', ') + ' and ' + communityList.slice(-1)
						: communityList[0];
				msg += ` covering the <span class="filter-selections">${formattedCommunityList} ${communityList.length > 1 ? 'communities' : 'community'}</span>`;
			}
		}

		if ($selectedLanguage) {
			const languageList = $selectedLanguage
				.toString()
				.split(',')
				.map((item) => item.trim());
			const formattedLanguageList =
				languageList.length > 1
					? languageList.slice(0, -1).join(', ') + ' and ' + languageList.slice(-1)
					: languageList[0];
			if ($selectedCommunity) {
				msg += ` and reporting in <span class="filter-selections">${formattedLanguageList}</span>`;
			} else {
				msg += ` reporting in <span class="filter-selections">${formattedLanguageList}</span>`;
			}
		}

		return msg;
	}

	$: if (!$selectedFormat && !$selectedCommunity & !$selectedLanguage) {
		filterMsg = ''; // No filters applied
	} else if (outletCount === 0) {
		filterMsg = 'No outlets found';
	} else {
		filterMsg = generateFilterMsg();
	}

	// Zoom to outlet location on map when outlet name is selected
	let lng;
	let lat;
	function flyTo(zoom, center) {
		$map.flyTo({
			zoom: zoom,
			center: center,
			essential: true
		});
	}

	// Highlight selected outlet on map
	$: if ($selectedOutlet) {
		$map.setPaintProperty('outlet-layer', 'circle-opacity', 0.25);
	}

	// Paginate outlet cards
	let currentPage = 0;
	const itemsPerPage = 20;

	// Search through cards, by outlet name
	$: filteredDirectoryBySearch = $filteredDirectory?.features.filter((outlet) =>
		outlet.properties['Media Outlet'].toLowerCase().includes(searchQuery.toLowerCase())
	);

	$: paginatedDirectory = filteredDirectoryBySearch
		.sort((a, b) => a.properties['Media Outlet'].localeCompare(b.properties['Media Outlet']))
		.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

	// Scroll to top of section when going between "pages"
	import { onMount } from 'svelte';
	let sectionRef;
	onMount(() => {
		sectionRef = document.querySelector('.header');
	});

	function scrollToTop() {
		if (sectionRef) {
			sectionRef.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<section id="outlet-cards" aria-label="List of media outlets">
	<!-- Intro text -->
	<div class="header">
		<!-- {#if !filterMsg}<p>
				Find below information about all <span style="font-weight: 600;"
					>{outletCount}
					outlets</span
				>
				in the directory. This list includes outlets without a known location that do not appear on the
				map. Apply filters in the <span class="tab">Search</span> tab to narrow down the results or search
				below to see if an outlet is in the list.
			</p>
		{/if} -->

		<!-- Message when filter has been applied -->
		{#if filterMsg}
			<p style="margin-bottom: 1rem;">
				<span style="font-family: 'Roboto Condensed'; display: flex; align-items: center; gap: 4px;"
					><Search /><strong
						>{[$selectedCommunity, $selectedFormat, $selectedLanguage].filter(Boolean).length >= 2
							? 'Filters'
							: 'Filter'} applied:</strong
					></span
				>
				{@html filterMsg}
			</p>
		{:else}
			<p>
				Find below information about all <span style="font-weight: 600;"
					>{outletCount}
					outlets</span
				>
				in the directory. This list includes outlets without a known location that do not appear on the
				map. Apply filters in the <span class="tab">Search</span> tab to narrow down the results or search
				below to see if an outlet is in the list.
			</p>
		{/if}
	</div>

	<!-- Search through cards field -->
	{#if $filteredDirectory.features.length > 1}
		<div class="search-field">
			<label for="search-input" class="visually-hidden"
				>Search by outlet to find if it is in the list</label
			>
			<input
				type="text"
				id="search-input"
				placeholder="Search by outlet name"
				bind:value={searchQuery}
				aria-label="Search by outlet name"
			/>

			<!-- Show clear search button when text has been entered -->
			{#if searchQuery}
				<button
					on:click={() => (searchQuery = '')}
					aria-label="Clear search terms"
					class="clear-form-btn"
					><CloseCircle fillColor="#7D7C7C" width="20px" height="20px" /></button
				>
			{/if}
		</div>
	{/if}

	<!-- Cards -->
	<div class="cards">
		{#each paginatedDirectory as outlet}
			<div class="outlet-card">
				<!-- Card header row -->
				<div class="header-row">
					<p class="outlet-name">{outlet.properties['Media Outlet']}</p>
					<p class="founded">
						{#if outlet.properties['Year Founded']}
							Since {outlet.properties['Year Founded']}
						{/if}
					</p>
				</div>

				<!-- Card body row -->
				<div class="body-row">
					<!-- Primary format -->
					<div class="body-line">
						<p class="category-label">Primary Format</p>
						<p class="category-value">{outlet.properties['Primary Format']}</p>
					</div>
					<hr class="outlet-card-divider" />
					<!-- Community -->
					<div class="body-line">
						<p class="category-label">
							{#if outlet.properties['Community'].toString().includes(',')}
								Communities
							{:else}
								Community
							{/if}
						</p>
						<p class="category-value">
							{outlet.properties['Community'].toString().replaceAll(',', ', ')}
						</p>
					</div>
					<hr class="outlet-card-divider" />
					<!-- Language -->
					<div class="body-line">
						<p class="category-label">
							{#if outlet.properties['Language'].toString().includes(',')}
								Languages
							{:else}
								Language
							{/if}
						</p>
						<p class="category-value">
							{outlet.properties['Language'].toString().replaceAll(',', ', ')}
						</p>
					</div>
				</div>

				<!-- Card footer row -->
				<div class="footer-row">
					<!-- Buttons -->
					<div class="action-btns">
						{#if outlet.properties['Website']}
							<a href={outlet.properties['Website']} class="card-btn website-btn" target="_blank"
								><OpenLink /> Visit website</a
							>
						{/if}
						{#if outlet.geometry.coordinates[0]}<button
								class="card-btn map-btn"
								on:click={() => {
									$selectedOutlet = outlet.properties['Media Outlet'];

									lng = outlet.geometry.coordinates[0];
									lat = outlet.geometry.coordinates[1];

									outlet.geometry.coordinates[0] !== undefined ? flyTo(10, [lng, lat]) : null;
								}}><MapPin strokeColor="#41B06E" /> Find on map</button
							>
						{/if}
					</div>

					<!-- City -->
					<p class="location">
						{#if outlet.properties['City']}
							<span style="color: #41B06E;">{outlet.properties['City']}</span>
						{:else}
							<span style="color: gray;">Location unavailable</span>
						{/if}
					</p>
				</div>
			</div>
		{/each}
	</div>

	<!-- Page buttons -->
	<div class="page-btns">
		<!-- previous button -->
		<button
			on:click={scrollToTop}
			on:click={() => (currentPage = Math.max(currentPage - 1, 0))}
			disabled={currentPage === 0}
			class:disabled={currentPage === 0}
		>
			<LeftArrow />
		</button>

		<!-- # of # -->
		<span
			><strong>{currentPage + 1}</strong> of
			<strong>{Math.ceil(filteredDirectoryBySearch.length / itemsPerPage)}</strong></span
		>

		<!-- next button -->
		<button
			on:click={scrollToTop}
			on:click={() =>
				(currentPage = Math.min(
					currentPage + 1,
					Math.ceil(filteredDirectoryBySearch.length / itemsPerPage) - 1
				))}
			disabled={currentPage === Math.ceil(filteredDirectoryBySearch.length / itemsPerPage) - 1}
			class:disabled={currentPage ===
				Math.ceil(filteredDirectoryBySearch.length / itemsPerPage) - 1}
		>
			<RightArrow />
		</button>
	</div>
</section>

<style>
	.header {
		border-radius: 1px;
		color: var(--text-color-black);
		font-size: 0.85rem;
		padding: 0.25rem;
	}

	.search-field {
		margin-top: 5px;
		margin-bottom: 1rem;
	}

	.search-field input {
		width: 100%;
		padding: 0.5rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	.outlet-card {
		background-color: var(--white-blue);
		border: 1px solid #dee2e6;
		border-radius: 3px;
		margin-bottom: 2rem;
		box-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.1);
	}

	.outlet-name {
		font-size: 1rem;
		font-weight: 600;
		font-family: 'Roboto Condensed', sans-serif;
	}

	.header-row,
	.footer-row {
		display: flex;
		justify-content: space-between;
		/* gap: 10px; */
		align-items: baseline;
	}

	.header-row {
		border-bottom: 1px solid #c2d6df;
		padding: 0.5rem 0.5rem 0.25rem;
	}

	.footer-row {
		align-items: center;
		background-color: #f0f0f0;
		padding: 0.4rem 0.5rem 0.35rem 0.5rem;
	}

	.body-row {
		font-size: 0.85rem;
		padding: 0.25rem 0.5rem;
	}

	.body-line {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.category-label {
		font-weight: 600;
		font-family: 'Roboto Condensed', 'sans-serif';
		font-size: 0.7rem;
		text-transform: uppercase;
		line-height: 1;
		color: #999999;
		flex-basis: 50%;
	}

	.category-value {
		font-weight: 400;
		text-align: right;
	}

	.founded,
	.location {
		font-size: 0.75rem;
		font-weight: 400;
		text-transform: uppercase;
		font-family: 'Roboto Condensed', sans-serif;
	}

	.founded {
		font-weight: 400;
	}

	.action-btns {
		display: flex;
		justify-content: space-between;
		gap: 6px;
	}

	.location {
		width: 26%;
		text-align: right;
	}

	.card-btn {
		border-radius: 3px;
		color: var(--text-color-black);
		font-size: 0.75rem;
		padding: 5px 8px;
		text-decoration: none;
		display: flex;
		align-items: center;
		gap: 3px;
		font-family: 'DM Sans', sans-serif;
		text-align: left;
		line-height: 1;
	}

	.website-btn {
		background-color: var(--white-blue);
		border: 1px solid #8aceef;
	}

	.website-btn:hover {
		background-color: #ebf5ff;
		transition: 0.5s;
	}

	.map-btn {
		background-color: var(--white-blue);
		border: 1px solid #a0d5ae;
	}

	.map-btn:hover {
		background-color: #eaf5ed;
		transition: 0.5s;
	}

	.page-btns {
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: 'Roboto Condensed', sans-serif;
	}

	.page-btns button.disabled {
		visibility: hidden;
	}

	/* Visually hidden label for screen readers */
	.visually-hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}

	.search-field {
		position: relative;
	}

	.clear-form-btn {
		position: absolute;
		top: 60%;
		transform: translateY(-60%);
		right: 0;
	}
</style>
