import { System } from './system';
import type { GameState } from '$lib/game/core/state/game_state.svelte';

/**
 *  A system that runs on a throttled interval as opposed to running every frame.
 */
export abstract class ThrottledSystem extends System {
	private timeAccumulator = 0;
	private readonly updateInterval: number;

	/**
	 * @param state The game state
	 * @param frequencyHz How many times per second this system should run (e.g. 8)
	 */
	constructor(state: GameState, frequencyHz: number) {
		super(state);
		// convert frequency (8 Hz) to interval (0.125 seconds)
		this.updateInterval = 1.0 / frequencyHz;
	}

	tick(delta_seconds: number): void {
		this.timeAccumulator += delta_seconds;

		if (this.timeAccumulator >= this.updateInterval) {
			this.runThrottled();

			// reset the accumulator.
			//
			// NOTE: we subtract interval rather than setting to 0 to preserve
			// any "overflow" time, keeping the average frequency accurate.
			this.timeAccumulator -= this.updateInterval;

			// If huge lag causes accumulation to be > interval * 2,
			// just hard reset to avoid a "death loop" of catch-up calls.
			if (this.timeAccumulator > this.updateInterval) {
				this.timeAccumulator = 0;
			}
		}
	}

	protected abstract runThrottled(): void;
}
