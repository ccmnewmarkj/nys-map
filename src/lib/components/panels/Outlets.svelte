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

	export let outletCount;

	let filterMsg;

	function generateFilterMsg() {
		let msg = `Showing ${outletCount} `;

		if ($selectedFormat) {
			msg += `<span class="outlets-filter-msg">${$selectedFormat.replace('Digital only', 'Digital-only outlet').replace('Radio', 'Radio station').replace('TV', 'TV station').toLowerCase()}${outletCount > 1 ? 's' : ''}</span>`;
		} else {
			msg += `${outletCount > 1 ? 'outlets' : 'outlet'}`;
		}

		if ($selectedCommunity) {
			if ($selectedCommunity.toString() === 'Multicultural') {
				msg += ` covering <span class="outlets-filter-msg">Multicultural communitities</span>`;
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
				msg += ` covering the <span class="outlets-filter-msg">${formattedCommunityList} ${communityList.length > 1 ? 'communities' : 'community'}</span>`;
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
				msg += ` and reporting in <span class="outlets-filter-msg">${formattedLanguageList}</span>`;
			} else {
				msg += ` reporting in <span class="outlets-filter-msg">${formattedLanguageList}</span>`;
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

	$: paginatedDirectory = $filteredDirectory?.features
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

<!-- Intro -->
<section class="intro">
	<div class="header">
		<h2 style="margin-top: 0;">NYS Media Directory</h2>
		{#if !filterMsg}<p style="padding-top: 5px;">
				Find below information about the {outletCount}
				outlets. This list includes outlets without a known location and do not appear on the map. Apply
				filters in the <span class="tab">Search</span> tab to narrow down the results.
			</p>
		{/if}
		<p style="line-height: 1.4;">{@html filterMsg}</p>
	</div>
</section>

<!-- Cards -->
<section class="cards">
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
				<hr />
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
				<hr />
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
</section>

<section class="pages">
	<div class="page-btns-container">
		<!-- previous button -->
		<button
			on:click={scrollToTop}
			on:click={() => (currentPage = Math.max(currentPage - 1, 0))}
			disabled={currentPage === 0}
			class:disabled={currentPage === 0}
		>
			<LeftArrow />
			<!-- &lt; -->
		</button>

		<!-- # of # -->
		<span
			><strong>{currentPage + 1}</strong> of
			<strong>{Math.ceil($filteredDirectory?.features.length / itemsPerPage)}</strong></span
		>

		<!-- next button -->
		<button
			on:click={scrollToTop}
			on:click={() =>
				(currentPage = Math.min(
					currentPage + 1,
					Math.ceil($filteredDirectory?.features.length / itemsPerPage) - 1
				))}
			disabled={currentPage === Math.ceil($filteredDirectory?.features.length / itemsPerPage) - 1}
			class:disabled={currentPage ===
				Math.ceil($filteredDirectory?.features.length / itemsPerPage) - 1}
		>
			<RightArrow />
			<!--&gt;-->
		</button>
	</div>
</section>

<style>
	.header {
		border-radius: 1px;
		color: var(--text-color-black);
		font-size: 0.8rem;
		margin-bottom: 1rem;
		padding: 0.25rem;
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

	.page-btns-container {
		display: flex;
		justify-content: center;
		align-items: center;
		font-family: 'Roboto Condensed', sans-serif;
	}

	.page-btns-container button.disabled {
		visibility: hidden;
	}
</style>
