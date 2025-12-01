import type { GameState } from '$lib/game/core/game_state.svelte';

export abstract class ScreenObject {
	id = crypto.randomUUID();
	x_pos: number;
	y_pos: number;

	// Lifecycle logic
	spawnedAt: number = Date.now();
	abstract duration: number;

	/**
	 * Creates a new screen object.
	 * * @param x_pos Horizontal position as a percentage of the screen width.
	 * @param y_pos Vertical position as a percentage of the screen height.
	 */
	constructor(x_pos: number, y_pos: number) {
		this.x_pos = x_pos;
		this.y_pos = y_pos;
	}

	/**
	 * Optional hook for when the object expires naturally.
	 */
	onExpire(_game: GameState): void {}

	get isExpired(): boolean {
		return Date.now() - this.spawnedAt >= this.duration;
	}
}
