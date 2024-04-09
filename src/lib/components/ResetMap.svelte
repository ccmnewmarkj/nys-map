<script>
	import { map } from '$lib/stores.js';

	const centerMap = { lng: -75.2, lat: 42.9 };
</script>

<button
	class="resetBtn-map"
	on:click|stopPropagation={() => {
		$map.flyTo({
			center: [centerMap.lng, centerMap.lat],
			essential: true, // "this animation is considered essential with respect to prefers-reduced-motion"
			zoom: 6.25,
			speed: 1,
			curve: 1
		});
	}}><slot /></button
>

<style>
	.resetBtn-map {
		background-color: rgba(243, 185, 95, 0.9);
		border: 1px solid #f5a64c;
		cursor: pointer;
		color: #333;
		padding: 0.45rem 0.75rem;
		border-radius: 2px;
		font-size: 0.9rem;
		font-weight: 700;
		text-transform: uppercase;
	}
</style>
