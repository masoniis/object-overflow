<script lang="ts">
	import { GameState } from '$lib/game/core/game_state.svelte';
	import getClickCoordinates from '$lib/game/utils/click_coordinates';
	import Settings from './Settings.svelte';

	let { isSettingsModalOpen = $bindable(), gameContainer } = $props<{
		isSettingsModalOpen: boolean;
		gameContainer: HTMLElement;
	}>();

	const gameState = GameState.getInstance();
</script>

<Settings bind:isOpen={isSettingsModalOpen} />

<div class="flex flex-row justify-between items-center border-b-1">
	<div>
		<h1 class="text-lg">
			You have <span class="font-bold">{Math.floor(gameState.objects)}</span> objects!
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
			Get +{gameState.manualClickPower} object
		</button>

		<button onclick={() => (isSettingsModalOpen = true)}>⚙️</button>
	</div>
</div>
