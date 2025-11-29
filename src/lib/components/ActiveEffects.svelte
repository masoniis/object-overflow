<script lang="ts">
	import { GameState } from '$lib/game/core/game_state.svelte';
	const gameState = GameState.getInstance();
</script>

{#if gameState.effects.length > 0}
	<div>
		<h2>Active effects</h2>
		<ul>
			{#each gameState.effects as effect (effect.id)}
				<li>{effect.name}: {effect.description}</li>
			{/each}
		</ul>
	</div>
{/if}
