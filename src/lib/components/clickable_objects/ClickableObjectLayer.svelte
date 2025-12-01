<script lang="ts">
	import { GameState } from '$lib/game/core/game_state.svelte';
	import GoldenObjectCircle from './GoldenObjectCircle.svelte';
	import { GoldenObject } from '$lib/game/models/screen_objects/interactive/golden_object';
	import NefariousObjectCircle from './NefariousObjectCircle.svelte';
	import { NefariousObject } from '$lib/game/models/screen_objects/interactive/nefarious_object';
	import { FloatingText } from '$lib/game/models/screen_objects/floating_text/floating_text';
	import FloatingTextElement from './FloatingTextElement.svelte';

	const gameState = GameState.getInstance();

	const goldenObjects = $derived(
		gameState.screenObjects.filter((obj): obj is GoldenObject => obj instanceof GoldenObject)
	);

	const nefariousObjects = $derived(
		gameState.screenObjects.filter((obj): obj is NefariousObject => obj instanceof NefariousObject)
	);

	const floatingTexts = $derived(
		gameState.screenObjects.filter((obj): obj is FloatingText => obj instanceof FloatingText)
	);
</script>

{#each goldenObjects as goldenObject (goldenObject.id)}
	<GoldenObjectCircle
		object={goldenObject}
		onClick={() => {
			goldenObject.interact(gameState);
		}}
	/>
{/each}

{#each nefariousObjects as nefariousObject (nefariousObject.id)}
	<NefariousObjectCircle
		object={nefariousObject}
		onClick={() => {
			nefariousObject.interact(gameState);
		}}
	/>
{/each}

{#each floatingTexts as textObj (textObj.id)}
	<FloatingTextElement object={textObj} />
{/each}
