<script lang="ts">
	import Modal from '$lib/components/reusable/Modal.svelte';
	import { GameState } from '$lib/game/core/game_state.svelte';

	let { isOpen = $bindable() }: { isOpen: boolean } = $props();
	const gameState = GameState.getInstance();
	let hasSaveData = $state(gameState.hasSaveData());
</script>

<Modal bind:isOpen title="Settings">
	<div class="flex flex-col gap-3 min-w-[250px]">
		<button
			class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
			onclick={() => {
				gameState.save();
				hasSaveData = true;
			}}
		>
			<span>💾</span> Save Progress
		</button>

		{#if gameState.savedObjectCount !== null}
			<div class="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm">
				<div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
					Current Save File
				</div>
				<div class="flex justify-between items-center text-gray-700">
					<span>Objects stored:</span>
					<span class="font-mono font-bold text-blue-600 text-lg">
						{Math.floor(gameState.savedObjectCount).toLocaleString()}
					</span>
				</div>
			</div>
		{/if}

		<button
			class="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all"
			onclick={() => {
				gameState.load();
			}}
			disabled={!hasSaveData}
		>
			Load Game
		</button>

		<hr class="border-gray-100 my-1" />

		<button
			class="text-gray-500 hover:text-gray-800 hover:bg-gray-100 py-2 rounded text-sm transition-colors"
			onclick={() => (isOpen = false)}
		>
			Close
		</button>
	</div>
</Modal>
