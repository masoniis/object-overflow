import type { GameState } from '$lib/game/core/state/game_state.svelte';
import type { Tickable } from '$lib/game/core/engine/tickable';

/**
 *  A class for systems that act upon the game state based on the engine event loop.
 */
export abstract class System implements Tickable {
	protected state: GameState;

	constructor(state: GameState) {
		if (!state) {
			throw new Error(`${this.constructor.name} requires GameState!`);
		}
		this.state = state;
	}

	abstract tick(delta_seconds: number): void;
}
