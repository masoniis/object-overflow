<script lang="ts">
	import { GameState } from '$lib/game/core/game_state.svelte';
	import { onMount } from 'svelte';
	import { createStandardGame } from '$lib/game/core/setup_game';
	import Settings from '$lib/components/Settings.svelte';
	import ClickableObjectLayer from '$lib/components/clickable_objects/ClickableObjectLayer.svelte';
	import Upgrades from '$lib/components/Upgrades.svelte';

	// INFO: -------------------------
	//         ui shared state
	// -------------------------------
	let isSettingsModalOpen = $state(false);

	// INFO: --------------------
	//         setup game
	// --------------------------
	const gameState = GameState.getInstance();

	onMount(() => {
		const engine = createStandardGame();
		engine.start();
		return () => engine.stop();
	});
</script>

<Settings bind:isOpen={isSettingsModalOpen} />

<div class="relative px-2">
	<ClickableObjectLayer />

	<div class="flex flex-row justify-between p-2">
		<h1 class="self-center">
			You have <span class="font-bold">{Math.floor(gameState.objects)}</span> objects!
		</h1>
		<p class="self-center">
			Producing <span class="font-bold">{gameState.totalObjectProduction.toFixed(2)}</span> objects/second
		</p>

		<div>
			<button onclick={() => gameState.modifyResource('object', gameState.manualClickPower)}
				>Get +{gameState.manualClickPower} object</button
			>
			<button onclick={() => (isSettingsModalOpen = true)}>⚙️</button>
		</div>
	</div>

	{#if gameState.effects.length > 0}
		<div class="p-2">
			<hr class="py-2" />
			<h2>Active effects:</h2>
			<ul>
				{#each gameState.effects as effect (effect.id)}
					<li>{effect.name}: {effect.description}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<hr class="py-2" />

	<Upgrades />

	<div class="grid grid-cols-1 sm:grid-cols-2">
		{#each gameState.producers as producer (producer.id)}
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
				<p>
					Production: {producer.totalProduction(gameState)}/sec of
					<em>{producer.outputResourceId}</em>
				</p>
			</div>
		{/each}
	</div>

	<hr class="py-2" />
</div>
