<script lang="ts">
	import { getGameState } from '$lib/game/ui_bridge/game_context';

	const gameState = getGameState();
</script>

<div>
	<h2>Upgrades</h2>
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
		{#each gameState.upgrades as upgrade (upgrade.id)}
			{#if !upgrade.isPurchased && upgrade.requirementsMet(gameState)}
				<div class="bg-gray-300 dark:bg-gray-600 m-1 p-2 rounded-2xl">
					<h3 class="flex flex-row justify-between pb-1.5">
						<div class="font-bold content-center">{upgrade.name}</div>
						<button
							disabled={gameState.playerStats.objects < upgrade.cost}
							onclick={() => upgrade.purchase(gameState)}
						>
							Buy (💰{upgrade.cost})
						</button>
					</h3>
					<hr />
					<p>{upgrade.description}</p>
				</div>
			{/if}
		{/each}
	</div>
</div>
