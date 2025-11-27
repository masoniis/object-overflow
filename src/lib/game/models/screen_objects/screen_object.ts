import type { GameState } from '$lib/game/core/game_state.svelte';

export abstract class ScreenObject {
	id = crypto.randomUUID();

	// Position (0-100%)
	x: number;
	y: number;

	// Lifespan logic
	spawnedAt: number = Date.now();
	abstract duration: number; // How long it stays on screen (ms)

	// Visuals
	abstract icon: string; // "🌟", "💀", etc.
	abstract cssClass: string; // "golden", "red", etc.

	constructor() {
		this.x = Math.random() * 100;
		this.y = Math.random() * 100;
	}

	/**
	 * What happens when the user clicks this object.
	 */
	abstract onClick(game: GameState): void;

	/**
	 * Optional: What happens if the object disappears without being clicked?
	 * (e.g., a "Golden Object" might give a "Missed!" message)
	 */
	onExpire(_game: GameState): void {
		// Default: do nothing
	}

	get isExpired(): boolean {
		return Date.now() - this.spawnedAt >= this.duration;
	}
}
