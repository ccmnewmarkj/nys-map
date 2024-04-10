<script>
	import { map } from '$lib/stores.js';

	const centerMap = { lng: -75.2, lat: 42.9 };
</script>

<button
	class="reset-map"
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
	button.reset-map {
		background-color: #fdfdfd;
		padding: 5px 6px;
		border-radius: 4px;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 30px;
		height: 30px;
		box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.15);
		border: 0px solid rgba(0, 0, 0, 0.25);
		cursor: pointer;
	}
</style>
