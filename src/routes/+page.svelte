<script lang="ts">
	import { GameState } from '$lib/game/GameState.svelte.js';

	const gameState = GameState.getInstance();
</script>

<p>Objects: {gameState.objects}</p>

<button onclick={() => gameState.addObjects(1)}>Add Object</button>
