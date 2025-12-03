<script lang="ts">
	import Modal from '$lib/components/reusable/Modal.svelte';
	import { GameState } from '$lib/game/core/state/game_state.svelte';
	import { getGameState } from '$lib/game/ui_bridge/game_context';
	import { saveMeta, refreshSaveMeta } from '$lib/game/ui_bridge/save_metadata.svelte';

	const gameState: GameState = getGameState();

	let { isOpen = $bindable() }: { isOpen: boolean } = $props();
	$effect(() => {
		if (isOpen) {
			refreshSaveMeta();
		}
	});
</script>

<Modal bind:isOpen title="Settings">
	<div class="flex flex-col gap-3 min-w-[250px]">
		<button
			class="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
			onclick={() => {
				gameState.saves.save();
				refreshSaveMeta();
			}}
		>
			<span>💾</span> Save Progress
		</button>

		{#if saveMeta.hasSave}
			<div class="bg-gray-50 border border-gray-200 rounded-md p-3 text-sm">
				<div class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
					Current Save File
				</div>
				<div class="flex justify-between items-center text-gray-700">
					<span>Objects stored</span>
					<span class="font-mono font-bold text-blue-600 text-lg">
						{Math.floor(saveMeta.currencyStored).toLocaleString()}
					</span>
				</div>
				<div class="flex justify-between items-center text-gray-700">
					<span>Lifetime profit</span>
					<span class="font-mono font-bold text-blue-600 text-lg">
						{Math.floor(saveMeta.lifetimeCurrency).toLocaleString()}
					</span>
				</div>
				<div class="text-[10px] text-gray-400 text-right mt-1">
					Last saved: {new Date(saveMeta.timestamp).toLocaleTimeString()}
				</div>
			</div>
		{/if}

		<button
			class="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all"
			onclick={() => {
				gameState.saves.load(gameState);
				isOpen = false;
			}}
			disabled={!saveMeta.hasSave}
		>
			Load Game
		</button>

		<button
			class="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-lg text-sm transition-colors border border-red-200"
			onclick={() => {
				if (confirm('Are you sure you want to wipe your save? This cannot be undone.')) {
					gameState.saves.wipeSave();
					refreshSaveMeta();
				}
			}}
		>
			Wipe Save
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
