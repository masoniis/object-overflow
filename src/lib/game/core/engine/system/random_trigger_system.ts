import { System } from './system';
import type { GameState } from '$lib/game/core/state/game_state.svelte';

/**
 *  A system that is triggered randomly based on an interval.
 */
export abstract class RandomTriggerSystem extends System {
	private timeToNextTrigger: number;
	private minSeconds: number;
	private maxSeconds: number;

	constructor(state: GameState, minSeconds: number, maxSeconds: number) {
		super(state);
		this.minSeconds = minSeconds;
		this.maxSeconds = maxSeconds;

		// initialize the first timer immediately
		this.timeToNextTrigger = this.getRandomInterval();
	}

	tick(delta_seconds: number): void {
		this.timeToNextTrigger -= delta_seconds;

		if (this.timeToNextTrigger <= 0) {
			this.onTrigger();
			// reset the timer for the next loop
			this.timeToNextTrigger = this.getRandomInterval();
		}
	}

	private getRandomInterval(): number {
		return Math.random() * (this.maxSeconds - this.minSeconds) + this.minSeconds;
	}

	/**
	 * The logic to execute when the random timer fires.
	 */
	protected abstract onTrigger(): void;
}
