<script lang="ts">
	import GoldenObjectCircle from './GoldenObjectCircle.svelte';
	import { GoldenObject } from '$lib/game/features/screen_objects/interactive/golden_object';
	import NefariousObjectCircle from './NefariousObjectCircle.svelte';
	import { NefariousObject } from '$lib/game/features/screen_objects/interactive/nefarious_object';
	import { FloatingText } from '$lib/game/features/screen_objects/visual/floating_text';
	import FloatingTextElement from './FloatingTextElement.svelte';
	import { getGameState } from '$lib/game/ui_bridge/game_context';

	const gameState = getGameState();

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
		object={goldenObject as GoldenObject}
		onClick={() => {
			(goldenObject as GoldenObject).interact(gameState);
		}}
	/>
{/each}

{#each nefariousObjects as nefariousObject (nefariousObject.id)}
	<NefariousObjectCircle
		object={nefariousObject as NefariousObject}
		onClick={() => {
			(nefariousObject as NefariousObject).interact(gameState);
		}}
	/>
{/each}

{#each floatingTexts as textObj (textObj.id)}
	<FloatingTextElement object={textObj as FloatingText} />
{/each}
