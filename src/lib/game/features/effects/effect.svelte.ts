import type { GameState } from '$lib/game/core/state/game_state.svelte';

/**
 * A game element that exists temporarily and changes the way state is modified
 * (eg boosts, "golden object," etc)
 */
export abstract class Effect {
	/**
	 * The timestamp when the effect was applied.
	 */
	appliedAt = $state(Date.now());

	constructor(
		public id: string,
		public name: string,
		public description: string,
		public duration: number | null // null is infinite
	) {
		this.appliedAt = Date.now();
	}

	/**
	 * A function called when an effect is first added too the game.
	 * @param gameState The game state to modify.
	 */
	onApply(_gameState: GameState): void {
		// default to no effect
	}

	/**
	 * A function called when an effect is removed (expired or otherwise).
	 * @param gameState The game state to modify.
	 */
	onRemove(_gameState: GameState): void {
		// default to no effect
	}

	/**
	 * Checks if the effect has expired.
	 */
	get isExpired(): boolean {
		if (this.duration === null) {
			return false;
		}
		return Date.now() - this.appliedAt >= this.duration;
	}
}
