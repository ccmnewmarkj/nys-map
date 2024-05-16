<script>
	export let outletCount;

	// CCM logo
	import logo from '$lib/images/ccm-logo-transparent.png';
</script>

<section class="about-body">
	<p>
		This map of <span style="font-weight: 800;"
			>community media outlets in New York State, north of New York City</span
		>, includes {outletCount}
		outlets that primarily cover communities of color and immigrants. The map accompanies the New York
		State Media Directory, which together serve as a resource for advertisers, journalists, community
		organizers, and others who want to connect with the community media sector in New York State. You
		can see the list of outlets under the <span class="tab">Outlets</span> button
	</p>
	<p class="callout" style="margin-top: 1rem;">
		For community media outlets in New York City, visit CCM's <a
			href="http://ccm-directory.journalism.cuny.edu">Many Voices, One City</a
		> directory.
	</p>

	<h2>How to use the map</h2>
	<p>
		Select the <span class="tab">Search</span> button to apply filters that will narrow down the
		number of outlets, whether by community, language or media type. The list of outlets that appear
		under the
		<span class="tab">Outlets</span> button will update accordingly.
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

<section class="about-footer">
	<a href="https://www.journalism.cuny.edu/centers/center-community-media/"
		><img src={logo} alt="Center for Community Media logo" width="175" height="46" /></a
	>
</section>

<style>
	.about-body {
		padding: 1rem;
	}

	.about-footer {
		margin-top: 1rem;
		padding: 1rem 1rem 0.5rem 1rem;
		background-color: var(--light-gray);
	}

	p:not(:first-child) {
		margin-top: 0.5rem;
	}
</style>
