<script lang="ts">
	import { GameState } from '$lib/game/state/game_state.svelte.js';
	import { GameEngine } from '$lib/game/engine/game_engine.svelte.js';
	import { ApplyProductionSystem } from '$lib/game/engine/systems/apply_production.js';
	import { AutosaveSystem } from '$lib/game/engine/systems/autosave.js';
	import { onMount } from 'svelte';

	const gameState = GameState.getInstance();
	let hasSaveData = $state(false);

	onMount(() => {
		hasSaveData = gameState.hasSaveData();

		const engine = new GameEngine()
			.addSystem(new ApplyProductionSystem(gameState))
			.addSystem(new AutosaveSystem(gameState));
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

<hr class="py-2" />

<div class="grid grid-cols-1 sm:grid-cols-2">
	{#each gameState.producers as producer}
		<div class="bg-gray-300 dark:bg-gray-600 m-1 p-2 rounded-2xl">
			<h3 class="flex flex-row justify-between pb-1.5">
				<div class="font-bold content-center">{producer.name}</div>
				<button
					disabled={gameState.objects < producer.currentCost}
					onclick={() => producer.buy(gameState)}
				>
					Buy (💰{producer.currentCost})
				</button>
			</h3>
			<hr />
			<p>Owned: {producer.count}</p>
			<p>Production: {producer.totalProduction}/sec</p>
		</div>
	{/each}
</div>
