<script>
	// Import stores
	import {
		map,
		filteredDirectory,
		selectedFormat,
		selectedCommunity,
		selectedLanguage,
		selectedOutlet,
		directoryData
	} from '$lib/stores.js';

	// Import icon components
	import OpenLink from '$lib/components/icons/OpenLink.svelte';
	import MapPin from '$lib/components/icons/MapPin.svelte';
	import LeftArrow from '$lib/components/icons/LeftArrow.svelte';
	import RightArrow from '$lib/components/icons/RightArrow.svelte';
	import CloseCircle from '$lib/components/icons/CloseCircle.svelte';
	import SearchIcon from '$lib/components/icons/Search.svelte';
	import MediaFormatIcon from '$lib/components/icons/MediaFormat.svelte';
	import PeopleIcon from '$lib/components/icons/People.svelte';
	import LanguagesIcon from '$lib/components/icons/Languages.svelte';

	export let outletCount;

	let filterMsg; // When a filter has been applied
	let searchQuery = ''; // Search through cards via outlet name

	function generateFilterTags() {
		let msg = '';

		// When format selected
		if ($selectedFormat) {
			// Icons from Google Fonts
			msg += `<span class="selected-filter-tag"><svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#686D76"><path d="M160-80q-17 0-28.5-11.5T120-120v-558q0-15 6-25.5t20-16.5l400-160q20-8 37 5.5t17 34.5v120h40q17 0 28.5 11.5T680-680v120h-80v-80H200v480h207l80 80H160Zm200-640h160v-62l-160 62ZM680-80q-83 0-141.5-58.5T480-280q0-83 58.5-141.5T680-480q83 0 141.5 58.5T880-280q0 83-58.5 141.5T680-80Zm-50-100 160-100-160-100v200Zm-430 20v-480 480Z"/></svg>
 ${$selectedFormat}</span>`;
		}

		if ($selectedCommunity) {
			// replace `,` with `, ` or before the last item, `and`
			const communityList = $selectedCommunity
				.toString()
				.split(',')
				.map((item) => item.trim());
			const formattedCommunityList =
				communityList.length > 1
					? communityList.slice(0, -1).join(', ') + ' and ' + communityList.slice(-1)
					: communityList[0];
			msg += `<span class="selected-filter-tag"><svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#686D76"><path
		d="M40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm720 0v-120q0-44-24.5-84.5T666-434q51 6 96 20.5t84 35.5q36 20 55 44.5t19 53.5v120H760ZM360-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm400-160q0 66-47 113t-113 47q-11 0-28-2.5t-28-5.5q27-32 41.5-71t14.5-81q0-42-14.5-81T544-792q14-5 28-6.5t28-1.5q66 0 113 47t47 113ZM120-240h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0 320Zm0-400Z" /></svg>${formattedCommunityList}</span>`;
		}

		if ($selectedLanguage) {
			msg += `<span class="selected-filter-tag"><svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 -960 960 960" width="18px" fill="#686D76"><path d="m476-80 182-480h84L924-80h-84l-43-122H603L560-80h-84ZM160-200l-56-56 202-202q-35-35-63.5-80T190-640h84q20 39 40 68t48 58q33-33 68.5-92.5T484-720H40v-80h280v-80h80v80h280v80H564q-21 72-63 148t-83 116l96 98-30 82-122-125-202 201Zm468-72h144l-72-204-72 204Z"/></svg>${$selectedLanguage}</span>`;
		}

		return msg;
	}

	$: if (!$selectedFormat && !$selectedCommunity & !$selectedLanguage) {
		filterMsg = ''; // No filters applied
	} else if (outletCount === 0) {
		filterMsg = 'No outlets found';
	} else {
		filterMsg = generateFilterTags();
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
		//.sort((a, b) => a.properties['Media Outlet'].localeCompare(b.properties['Media Outlet']))
		.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

	// Scroll to top of section when going between "pages"
	import { onMount } from 'svelte';
	import filter from 'svelte-select/filter';
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
	<div class="header" class:filters-active={filterMsg}>
		<!-- Message when filter has been applied -->
		{#if filterMsg}
			<p>
				<span style="font-family: 'Roboto Condensed'; display: flex; align-items: center; gap: 4px;"
					><SearchIcon /><strong
						>{[$selectedCommunity, $selectedFormat, $selectedLanguage].filter(Boolean).length >= 2
							? 'Filters'
							: 'Filter'} applied:</strong
					>
					Showing {outletCount} out of {$directoryData?.features.length} outlets</span
				>
			</p>
			<p style="margin-top: 5px; display: flex; flex-wrap: wrap; row-gap: 4px; column-gap: 6px;">
				{@html filterMsg}
			</p>
		{:else}
			<p style="margin-bottom: 5px;">
				This list of all <span style="font-weight: 600;"
					>{outletCount}
					outlets</span
				>
				includes those without a known location and do not appear on the map. Apply filters in the
				<span class="tab">Search</span> tab to narrow down the list or search for an outlet below.
			</p>
		{/if}
	</div>

	<!-- Search through cards field -->
	{#if $filteredDirectory.features.length > 1}
		<div class="search-field">
			<label for="search-input" class="visually-hidden"
				>Enter outlet name to find it in the list</label
			>
			<input
				type="text"
				id="search-input"
				placeholder="Search cards by outlet name"
				bind:value={searchQuery}
				aria-label="Search cards by outlet name"
			/>

			<!-- Show clear search button when text has been entered -->
			{#if searchQuery}
				<button
					on:click={() => (searchQuery = '')}
					aria-label="Clear search terms"
					class="clear-form-btn">✕</button
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
				<div class="body-container">
					<!-- Primary format -->
					<div class="body-row">
						<p class="category-label">
							<MediaFormatIcon width="14px" height="14px" /> Primary Format
						</p>
						<p class="category-value">{outlet.properties['Primary Format']}</p>
					</div>
					<hr class="outlet-card-divider" />
					<!-- Community -->
					<div class="body-row">
						<p class="category-label">
							{#if outlet.properties['Community'].toString().includes(',')}
								<PeopleIcon width="14px" height="14px" /> Communities
							{:else}
								<PeopleIcon width="14px" height="14px" /> Community
							{/if}
						</p>
						<p class="category-value">
							{outlet.properties['Community'].toString().replaceAll(',', ', ')}
						</p>
					</div>
					<hr class="outlet-card-divider" />
					<!-- Language -->
					<div class="body-row">
						<p class="category-label">
							{#if outlet.properties['Language'].toString().includes(',')}
								<LanguagesIcon width="14px" height="14px" /> Languages
							{:else}
								<LanguagesIcon width="14px" height="14px" /> Language
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
								aria-label="Highlights outlet marker on map"
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
			aria-label="Previous page of outlets"
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
			aria-label="Next page of outlets"
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

	.filters-active {
		background-color: var(--alice-blue-light);
		padding: 0.75rem;
		margin-bottom: 1rem;
		border-radius: 3px;
	}

	.search-field {
		margin-top: 0;
		margin-bottom: 2rem;
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
		margin-bottom: 1.75rem;
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

	.body-container {
		padding: 0.25rem 0.5rem;
	}

	.body-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.85rem;
	}

	.category-label {
		/* font-weight: 600; */
		font-family: 'Roboto Condensed', 'sans-serif';
		/* text-transform: uppercase; */
		line-height: 1;
		color: var(--gray);
		flex-basis: 50%;
		display: flex;
		align-items: center;
		gap: 4px;
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
		/* font-family: 'DM Sans', sans-serif; */
		font-family: 'Roboto Condensed', sans-serif;
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
		top: 55%;
		transform: translateY(-60%);
		right: 2px;
		font-weight: 800;
	}
</style>
