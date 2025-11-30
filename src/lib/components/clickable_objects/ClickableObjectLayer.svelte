<script lang="ts">
	import { GameState } from '$lib/game/core/game_state.svelte';
	import GoldenObject from './GoldenObject.svelte';
	import { GoldenObject as GoldenObjectClass } from '$lib/game/models/screen_objects/golden_object';
	import NefariousObject from './NefariousObject.svelte';
	import { NefariousObject as NefariousObjectClass } from '$lib/game/models/screen_objects/nefarious_object';

	const gameState = GameState.getInstance();

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

{#each goldenObjects as goldenObject (goldenObject.id)}
	<GoldenObject
		object={goldenObject}
		onClick={() => {
			goldenObject.onClick(gameState);
		}}
	/>
{/each}

{#each nefariousObjects as nefariousObject (nefariousObject.id)}
	<NefariousObject
		object={nefariousObject}
		onClick={() => {
			nefariousObject.onClick(gameState);
		}}
	/>
{/each}
