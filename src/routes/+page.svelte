<script lang="ts">
	import { GameState } from '$lib/game/core/game_state.svelte';
	import { GameEngine } from '$lib/game/core/game_engine.svelte';
	import { onMount } from 'svelte';
	import GoldenObject from '$lib/components/GoldenObject.svelte';
	import { GoldenObject as GoldenObjectClass } from '$lib/game/models/screen_objects/golden_object';

	// INFO: --------------------
	//         setup game
	// --------------------------
	const gameState = GameState.getInstance();
	let hasSaveData = $state(false);

	onMount(() => {
		hasSaveData = gameState.hasSaveData();

		const engine = new GameEngine();
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

	// INFO: -----------------------------
	//         derived ui elements
	// -----------------------------------

	const goldenObjects = $derived(
		gameState.screenObjects.filter(
			(obj): obj is GoldenObjectClass => obj instanceof GoldenObjectClass
		)
	);
</script>

<div class="relative">
	{#each goldenObjects as obj (obj.id)}
		<GoldenObject
			object={obj}
			onClick={() => {
				obj.onClick(gameState);
				gameState.removeScreenObject(obj);
			}}
		/>
	{/each}

	<h1>Currency: {Math.floor(gameState.objects)}</h1>

	<button onclick={() => gameState.addObjects(1)}>Add Object</button>
	<button onclick={manualSave}>Save Game</button>
	<button onclick={manualLoad} disabled={!hasSaveData}>Load Game</button>

	{#if gameState.effects.length > 0}
		<hr class="py-2" />
		<h2>Active Effects:</h2>
		<ul>
			{#each gameState.effects as effect}
				<li>{effect.name}: {effect.description}</li>
			{/each}
		</ul>
	{/if}

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
</div>
