import { System } from '../system';
import type { GameState } from '$lib/game/core/game_state.svelte';

export class AutosaveSystem extends System {
	private time_since_last_save = 0;

	constructor(
		protected state: GameState,
		private save_interval: number = 60
	) {
		super(state);
		this.save_interval = save_interval;
		console.log(`💾 Autosave set (${this.save_interval} seconds)`);
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
