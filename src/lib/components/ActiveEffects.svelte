<script lang="ts">
	import { getGameState } from '$lib/game/ui_bridge/game_context';

	const gameState = getGameState();
</script>

{#if gameState.effects.effectList.length > 0}
	<div>
		<h2>Active effects</h2>
		<ul>
			{#each gameState.effects.effectList as effect (effect.id)}
				<li>{effect.name}: {effect.description}</li>
			{/each}
		</ul>
	</div>
{/if}
