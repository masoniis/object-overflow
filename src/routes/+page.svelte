<script lang="ts">
	import ClickableObjectLayer from '$lib/components/clickable_objects/ClickableObjectLayer.svelte';
	import Upgrades from '$lib/components/Upgrades.svelte';
	import GameHeader from '$lib/components/GameHeader.svelte';
	import ActiveEffects from '$lib/components/ActiveEffects.svelte';
	import ProducerList from '$lib/components/ProducerList.svelte';
	import GameStateProvider from '$lib/components/GameStateProvider.svelte';

	// INFO: -------------------------
	//         shared ui state
	// -------------------------------
	let isSettingsModalOpen = $state(false);
	let gameContainer = $state<HTMLElement>();
</script>

<GameStateProvider>
	<div
		class="relative overflow-clip sm:px-4 px-2 min-h-screen min-w-screen"
		bind:this={gameContainer}
	>
		<ClickableObjectLayer />

		<GameHeader bind:isSettingsModalOpen {gameContainer} />

		<div class="space-y-2 sm:space-y-4 pt-4">
			<ActiveEffects />

			<Upgrades />

			<ProducerList />
		</div>
	</div>
</GameStateProvider>
