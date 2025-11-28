import type { Tickable } from './tickable_interface';
import type { GameState } from '$lib/game/game_state.svelte';

/// A class for systems that act upon the game state based ont he engine event loop.
export abstract class GameSystem implements Tickable {
	protected state: GameState;

	constructor(state: GameState) {
		if (!state) {
			throw new Error(`${this.constructor.name} requires GameState!`);
		}
		this.state = state;
	}

	abstract tick(dt: number): void;
}
