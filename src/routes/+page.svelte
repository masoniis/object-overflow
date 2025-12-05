<script lang="ts">
	import { onMount } from 'svelte';
	import { createStandardGame } from '$lib/game/core/setup_game';
	import ClickableObjectLayer from '$lib/components/clickable_objects/ClickableObjectLayer.svelte';
	import Upgrades from '$lib/components/Upgrades.svelte';
	import GameHeader from '$lib/components/GameHeader.svelte';
	import ActiveEffects from '$lib/components/ActiveEffects.svelte';
	import ProducerList from '$lib/components/ProducerList.svelte';

	// INFO: -------------------------
	//         ui shared state
	// -------------------------------
	let isSettingsModalOpen = $state(false);

	// INFO: --------------------
	//         setup game
	// --------------------------
	onMount(() => {
		const engine = createStandardGame();
		engine.start();
		return () => engine.stop();
	});
</script>

<div class="relative overflow-clip sm:px-4 px-2">
	<ClickableObjectLayer />

	<GameHeader bind:isSettingsModalOpen />

	<div class="space-y-2 sm:space-y-4 pt-4">
		<ActiveEffects />

		<Upgrades />

		<ProducerList />
	</div>
</div>

