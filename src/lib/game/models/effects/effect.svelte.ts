import type { GameState } from '$lib/game/core/game_state.svelte';

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
	 * A function to apply the effect to the game state.
	 * This is called when the effect is first added.
	 * @param gameState The game state to modify.
	 */
	onApply(_gameState: GameState): void {}

	/**
	 * A function to remove the effect from the game state.
	 * This is called when the effect expires or is removed.
	 * @param gameState The game state to modify.
	 */
	onRemove(_gameState: GameState): void {}

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
