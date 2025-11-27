<script lang="ts">
	import { GameState } from '$lib/game/game_state.svelte.js';
	import { GameEngine } from '$lib/game/engine/game_engine.svelte.js';
	import { UpdateProductionTickable } from '$lib/game/engine/tickables/update_production.js';
	import { onMount } from 'svelte';

	const gameState = GameState.getInstance();

	onMount(() => {
		const engine = new GameEngine();
		engine.addSystem(new UpdateProductionTickable(gameState));
		engine.start();
		return () => engine.stop();
	});
</script>

<h1>Currency: {Math.floor(gameState.objects)}</h1>

<button onclick={() => gameState.addObjects(1)}>Add Object</button>

<hr />

<div class="bg-gray-500">
	{#each gameState.producers as producer}
		<div class="item">
			<h3>{producer.name}</h3>
			<p>Owned: {producer.count}</p>
			<p>Production: {producer.totalProduction}/sec</p>

			<button
				disabled={gameState.objects < producer.currentCost}
				onclick={() => producer.buy(gameState)}
			>
				Buy (Cost: {producer.currentCost})
			</button>
		</div>
	{/each}
</div>
