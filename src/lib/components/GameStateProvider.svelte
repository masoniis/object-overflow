<script lang="ts">
	import { createStandardEngine } from '$lib/game/core/engine/create_standard_engine';
	import type { GameEngine } from '$lib/game/core/engine/game_engine.svelte';
	import { initGameContext } from '$lib/game/ui_bridge/game_context';
	import { onMount } from 'svelte';

	// initialize game context (all children will have access)
	const gameState = initGameContext({});

	// initialize engine on mount
	let engine: GameEngine;
	onMount(() => {
		engine = createStandardEngine(gameState);
		engine.start();

		return () => {
			engine.stop();
		};
	});
</script>

<slot />
