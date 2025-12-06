import { ThrottledSystem } from '$lib/game/core/engine/system';
import type { GameState } from '$lib/game/core/state/game_state.svelte';

export class AutosaveSystem extends ThrottledSystem {
	private static SAVE_INTERVAL_SECONDS = 60;

	constructor(state: GameState) {
		super(state, 1 / AutosaveSystem.SAVE_INTERVAL_SECONDS);
		console.log(`💾 Autosave set (${AutosaveSystem.SAVE_INTERVAL_SECONDS} seconds)`);
	}

	protected runThrottled() {
		console.log('💾 Performing autosave');
		this.state.saves.save();
	}
}
