import { GameSystem } from '../abstract_gamesystem.ts';
import type { GameState } from '$lib/game/game_state.svelte';

export class AutosaveSystem extends GameSystem {
	private time_since_last_save = 0;

	constructor(
		private state: GameState,
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
