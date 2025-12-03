<script lang="ts">
	import { GameState } from '$lib/game/core/game_state.svelte';
	import { onMount } from 'svelte';
	import GoldenObject from '$lib/components/GoldenObject.svelte';
	import { GoldenObject as GoldenObjectClass } from '$lib/game/models/screen_objects/golden_object';
	import NefariousObject from '$lib/components/NefariousObject.svelte';
	import { NefariousObject as NefariousObjectClass } from '$lib/game/models/screen_objects/nefarious_object';
	import Modal from '$lib/components/Modal.svelte';
	import { createStandardGame } from '$lib/game/core/setup_game';

	// INFO: --------------------
	//         setup game
	// --------------------------
	const gameState = GameState.getInstance();
	let hasSaveData = $state(gameState.hasSaveData());
	let isSettingsModalOpen = $state(false);

	onMount(() => {
		const engine = createStandardGame();
		engine.start();
		return () => engine.stop();
	});

	// INFO: -----------------------------
	//         derived ui elements
	// -----------------------------------

	const goldenObjects = $derived(
		gameState.screenObjects.filter(
			(obj): obj is GoldenObjectClass => obj instanceof GoldenObjectClass
		)
	);

	const nefariousObjects = $derived(
		gameState.screenObjects.filter(
			(obj): obj is NefariousObjectClass => obj instanceof NefariousObjectClass
		)
	);
</script>

<Modal bind:isOpen={isSettingsModalOpen} title="Settings">
	<div class="flex flex-col gap-3 min-w-[250px]">
		<button
			class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
			onclick={() => {
				gameState.save();
				hasSaveData = true;
			}}
		>
			<span>💾</span> Save Progress
		</button>

		{#if gameState.savedObjectCount !== null}
			<div class="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm">
				<div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
					Current Save File
				</div>
				<div class="flex justify-between items-center text-gray-700">
					<span>Objects stored:</span>
					<span class="font-mono font-bold text-blue-600 text-lg">
						{Math.floor(gameState.savedObjectCount).toLocaleString()}
					</span>
				</div>
			</div>
		{/if}

		<button
			class="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all"
			onclick={() => {
				gameState.load();
			}}
			disabled={!hasSaveData}
		>
			Load Game
		</button>

		<hr class="border-gray-100 my-1" />

		<button
			class="text-gray-500 hover:text-gray-800 hover:bg-gray-100 py-2 rounded text-sm transition-colors"
			onclick={() => (isSettingsModalOpen = false)}
		>
			Close
		</button>
	</div>
</Modal>

<div class="relative px-2">
	{#each goldenObjects as obj (obj.id)}
		<GoldenObject
			object={obj}
			onClick={() => {
				obj.onClick(gameState);
				gameState.removeScreenObject(obj);
			}}
		/>
	{/each}

	{#each nefariousObjects as obj (obj.id)}
		<NefariousObject
			object={obj}
			onClick={() => {
				obj.onClick(gameState);
				gameState.removeScreenObject(obj);
			}}
		/>
	{/each}

	<div class="flex flex-row justify-between p-2">
		<h1 class="self-center">
			You have <span class="font-bold">{Math.floor(gameState.objects)}</span> objects!
		</h1>

		<div>
			<button onclick={() => gameState.modifyResource('object', 1)}>Get +1 object</button>
			<button onclick={() => (isSettingsModalOpen = true)}>⚙️</button>
		</div>
	</div>

	{#if gameState.effects.length > 0}
		<div class="p-2">
			<hr class="py-2" />
			<h2>Active effects:</h2>
			<ul>
				{#each gameState.effects as effect}
					<li>{effect.name}: {effect.description}</li>
				{/each}
			</ul>
		</div>
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
				<p>
					Production: {producer.totalProduction}/sec of
					<em>{producer.outputResourceId}</em>
				</p>
			</div>
		{/each}
	</div>
</div>
