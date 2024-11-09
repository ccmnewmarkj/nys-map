<script>
	import { map } from '$lib/stores.js';

	export let centerMap;
	export let isMobile;
</script>

<button
	class="reset-map"
	aria-label="Reset map to initial position"
	on:click|stopPropagation={() => {
		$map.flyTo({
			center: [centerMap.lng, centerMap.lat],
			essential: true, // "this animation is considered essential with respect to prefers-reduced-motion"
			zoom: !isMobile ? 6.25 : 5,
			speed: 1,
			curve: 1
		});
	}}><slot /></button
>

<style>
	button.reset-map {
		background-color: var(--white);
		padding: 2px;
		border-radius: 4px;
		margin-left: auto;
		/* display: flex; */ /* if applied, doesn't appear on mobile */
		/* justify-content: center; */
		/* align-items: center; */
		width: 30px;
		height: 30px;
		box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.15);
		border: 0px solid rgba(0, 0, 0, 0.25);
		cursor: pointer;
		box-shadow: 0 0 5px 3px var(--yellow); /* outer glow */
	}
</style>
