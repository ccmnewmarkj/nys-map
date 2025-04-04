<script>
	export let outletCount;

	// Import icon components
	import MapPin from '$lib/components/icons/MapPin.svelte';

	// Logos
	import ccmABILogo from '$lib/images/CCM+TheAdvertisingBoostInitiative.png';
	import newmarkJLogo from '$lib/images/NewmarkJ-logo.png';
</script>

<section id="about-body" aria-labelledby="about-btn">
	<p>
		This map of <span style="font-weight: 800;"
			>community media outlets in New York State, north of New York City</span
		>, includes {outletCount}
		outlets that primarily cover communities of color and immigrants. The map accompanies the
		<strong
			><a href="https://airtable.com/appe9qcomiFJb4wyG/shrdltIHFKEmt8Nx2"
				>New York State Media Directory</a
			></strong
		>, which together serve as a resource for advertisers, journalists, community organizers, and
		others who want to connect with the community media sector in the state.

		<!-- You can see the list of
		outlets under the <span class="tab">Outlets</span> tab -->
	</p>
	<p class="callout" style="margin-top: 1rem;">
		For community media outlets in New York City, visit CCM's <strong
			><a href="http://ccm-directory.journalism.cuny.edu">Many Voices, One City</a></strong
		> directory.
	</p>

	<h2>How to use the map</h2>
	<p>
		Select the <span class="tab">Search</span> tab to apply filters that will narrow down the number
		of outlets, whether by community, language or media type. The list of outlets that appear under
		the
		<span class="tab">Outlets</span> tab will update accordingly.
	</p>
	<p class="address-search">
		You can also <span class="tab" style="background-color:transparent; padding:0;"
			>search by address</span
		>
		or city using the search bar. The map will then zoom in to the location, with a <MapPin
			strokeColor="#cc5f02"
		/> marker indicating the spot. To remove the marker, select the "X" in the search bar (which appears
		when you hover over, click or select the box) to clear it.
	</p>

	<h2>Add your outlet</h2>
	<p>
		If you have an outlet that is not part of the directory and fits the criteria, please <a
			href="https://airtable.com/appe9qcomiFJb4wyG/shrA9pyyreRoOqTe4">complete this form</a
		>.
	</p>
	<p>
		If you have any feedback, corrections or updates, please email us at <a
			href="mailto:ccm@journalism.cuny.edu">ccm@journalism.cuny.edu</a
		>.
	</p>
</section>

<section id="about-footer" aria-label="About the Advertising Boost Initiative">
	<p>
		The <strong
			><a
				href="https://www.journalism.cuny.edu/centers/center-community-media/advertising-boost-initiative/"
				>Advertising Boost Initiative</a
			></strong
		> (ABI) assists media outlets in New York City and across the state to become more effective in accessing
		their share of agencies’ advertising budgets. It advocates for the community media sector, making
		clear to marketing directors and communications staff at New York departments and agencies just how
		vital a role community media plays in civic life.
	</p>
	<hr />
	<a
		href="https://www.journalism.cuny.edu/centers/center-community-media/advertising-boost-initiative/"
		><img
			src={ccmABILogo}
			alt="Center for Community Media and Advertising Boost Initiative logo"
			width="325"
			height="auto"
		/></a
	>

	<a href="https://www.journalism.cuny.edu/"
		><img
			style="padding-top: 1rem;"
			src={newmarkJLogo}
			alt="Newmark J-School logo"
			width="310"
			height="auto"
		/></a
	>
</section>

<style>
	#about-body {
		padding: 1rem;
	}

	p:not(:first-child) {
		margin-top: 12px;
	}

	#about-footer {
		padding: 1rem;
		background-color: var(--light-gray);
		/* display: flex;
		flex-direction: column;
		align-items: center;
		row-gap: 20px; */
		font-size: 0.85rem;
	}

	@media only screen and (max-device-width: 512px) {
		p.address-search {
			display: none;
		}
	}
</style>
