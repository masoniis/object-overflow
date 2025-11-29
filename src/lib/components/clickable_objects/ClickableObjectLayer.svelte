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
