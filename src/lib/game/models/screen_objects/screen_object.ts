import type { GameState } from '$lib/game/core/game_state.svelte';

export abstract class ScreenObject {
	id = crypto.randomUUID();

	// Position (0-100%)
	x: number;
	y: number;

	// Lifespan logic
	spawnedAt: number = Date.now();
	abstract duration: number; // how long it stays on screen (ms)

	constructor() {
		this.x = Math.random() * 100;
		this.y = Math.random() * 100;
	}

	/**
	 * What happens when the user clicks this object.
	 */
	abstract onClick(game: GameState): void;

	/**
	 * What happens if the object disappears without being clicked?
	 */
	onExpire(_game: GameState): void {
		// defaults to nothing
	}

	get isExpired(): boolean {
		return Date.now() - this.spawnedAt >= this.duration;
	}
}
