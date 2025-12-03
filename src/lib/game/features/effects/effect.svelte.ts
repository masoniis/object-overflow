import type { GameState } from '$lib/game/core/state/game_state.svelte';

export interface EffectConfig {
	id: string;
	name: string;
	description: string;
	duration: number;
	shouldBeSaved?: boolean; // optional, defaults to true
}

export interface EffectSaveData<T = unknown> {
	id: string;
	type: string;
	data?: T;
}

/**
 * A game element that exists temporarily and changes the way state is modified
 * (eg boosts, "golden object," etc)
 */
export abstract class Effect<TSaveData = void> {
	public readonly id: string;
	public readonly name: string;
	public readonly description: string;
	public readonly duration: number;
	public readonly shouldBeSaved: boolean;

	/**
	 * The timestamp when the effect was applied.
	 */
	appliedAt = $state(Date.now());

	constructor({ id, name, description, duration, shouldBeSaved = true }: EffectConfig) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.duration = duration;
		this.shouldBeSaved = shouldBeSaved;
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
		if (this.duration === Infinity) {
			return false;
		}
		return Date.now() - this.appliedAt >= this.duration;
	}

	abstract readonly type: string;

	/**
	 * Returns the data needed to recreate this effect's state.
	 * Return undefined if no additional data is needed.
	 */
	abstract saveData(): TSaveData;
}
