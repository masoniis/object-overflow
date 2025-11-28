import type { Tickable } from './tickable_interface';
import type { GameState } from '$lib/game/game_state.svelte';

export class AutosaveTickable implements Tickable {
	private time_since_last_save = 0;

	constructor(
		private state: GameState,
		private save_interval: number = 60
	) {
		if (!state) {
			throw new Error('AutosaveTickable requires GameState!');
		}
		console.log(`💾 Autosave enabled every ${this.save_interval} seconds`);
	}

	tick(dt: number) {
		this.time_since_last_save += dt;

		if (this.time_since_last_save >= this.save_interval) {
			console.log('💾 Performing autosave');
			this.state.save();
			this.time_since_last_save = 0;
		}
	}
}
