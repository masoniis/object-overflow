<script lang="ts">
	import { GameState } from '$lib/game/game_state.svelte.js';
	import { GameEngine } from '$lib/game/engine/game_engine.svelte.js';
	import { ApplyProductionSystem } from '$lib/game/engine/systems/apply_production.js';
	import { AutosaveSystem } from '$lib/game/engine/systems/autosave.js';
	import { onMount } from 'svelte';

	const gameState = GameState.getInstance();
	let hasSaveData = $state(false);

	onMount(() => {
		hasSaveData = gameState.hasSaveData();

		const engine = new GameEngine();
		engine.addSystem(new ApplyProductionSystem(gameState));
		engine.addSystem(new AutosaveSystem(gameState));
		engine.start();
		return () => engine.stop();
	});

	function manualSave() {
		gameState.save();
		hasSaveData = true;
	}

	function manualLoad() {
		gameState.load();
	}
</script>

<h1>Currency: {Math.floor(gameState.objects)}</h1>

<button onclick={() => gameState.addObjects(1)}>Add Object</button>
<button onclick={manualSave}>Save Game</button>
<button onclick={manualLoad} disabled={!hasSaveData}>Load Game</button>

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
