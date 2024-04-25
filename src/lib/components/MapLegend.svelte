<script>
	// Color by format
	const newspaperFormat = '250, 112, 112',
		radioFormat = '64, 162, 227',
		magazineFormat = '115, 144, 114',
		digitalFormat = '255, 201, 74',
		otherFormat = '179, 200, 207';

	const legendItems = [
		{ label: 'Newspaper', color: newspaperFormat },
		{ label: 'Radio', color: radioFormat },
		{ label: 'Magazine', color: magazineFormat },
		{ label: 'Digital-only', color: digitalFormat }
	];
</script>

<div class="legend">
	{#each legendItems as item}
		<div class="legend-item">
			<span class="label">{item.label}</span>
			<span
				class="bullet"
				style="color: rgb({item.color}); background-color: rgba({item.color}, 0.1); text-shadow: 1px 0px 5px #ffffff;"
				>●</span
			>
		</div>
	{/each}
</div>

<style>
	.legend {
		padding: 5px 0 5px 5px;
		width: 125px;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		row-gap: 2px;
		font-family: 'Roboto Condensed', 'sans-serif;';
		font-size: 0.8rem;
	}

	.legend-item {
		line-height: 1.15;
	}

	.bullet {
		font-size: 1rem;
		margin-left: 5px;
		padding: 0 2px;
	}
</style>
