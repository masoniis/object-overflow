<script lang="ts">
	import { getGameState } from '$lib/game/ui_bridge/game_context';

	const gameState = getGameState();
</script>

<div>
	<h2>Producers</h2>
	<div class="grid grid-cols-1 sm:grid-cols-2">
		{#each gameState.producers as producer (producer.id)}
			<div class="bg-gray-300 dark:bg-gray-600 m-1 p-2 rounded-2xl">
				<h3 class="flex flex-row justify-between pb-1.5">
					<div class="font-bold content-center">{producer.name}</div>
					<button
						disabled={gameState.playerStats.objects < producer.currentCost}
						onclick={() => producer.buy(gameState)}
					>
						Buy (💰{producer.currentCost})
					</button>
				</h3>
				<hr />
				<p>Owned: {producer.count}</p>
				<p>
					Production: {producer
						.totalProduction(gameState.effects.getGlobalProductionMultiplier())
						.toFixed(2)}/sec of
					<em>{producer.outputResourceId}</em>
				</p>
			</div>
		{/each}
	</div>
</div>
