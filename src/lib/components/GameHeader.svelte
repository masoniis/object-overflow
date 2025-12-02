<script lang="ts">
	import getClickCoordinates from '$lib/game/ui_bridge/click_coordinates';
	import { getGameState } from '$lib/game/ui_bridge/game_context';
	import Settings from './Settings.svelte';

	const gameState = getGameState();

	let { isSettingsModalOpen = $bindable(), gameContainer } = $props<{
		isSettingsModalOpen: boolean;
		gameContainer: HTMLElement;
	}>();
</script>

<Settings bind:isOpen={isSettingsModalOpen} />

<div class="flex flex-row justify-between items-center border-b-1">
	<div>
		<h1 class="text-lg">
			You have <span class="font-bold">{Math.floor(gameState.playerStats.objects)}</span> objects!
		</h1>
		<p class="text-sm">
			Producing <span class="font-bold">{gameState.totalObjectProduction.toFixed(2)}</span>
			objects/second
		</p>
	</div>

	<div>
		<button
			onclick={(e) => {
				const coords = gameContainer ? getClickCoordinates(e, gameContainer) : { x: 50, y: 50 };
				gameState.actions.clickMainObjective(coords.x, coords.y);
			}}
		>
			Get +{gameState.playerStats.manualClickPower} object
		</button>

		<button onclick={() => (isSettingsModalOpen = true)}>⚙️</button>
	</div>
</div>
