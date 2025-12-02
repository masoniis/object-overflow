import { ResourceIds } from '$lib/game/core/state/constants';
import type { GameState } from '$lib/game/core/state/game_state.svelte';

export interface UpgradeSaveData {
	isPurchased: boolean;
}

export abstract class Upgrade {
	id: string;
	name: string;
	description: string;
	cost: number;
	isPurchased = $state(false);

	constructor(id: string, name: string, description: string, cost: number) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.cost = cost;
	}

	/**
	 * The core logic of the upgrade.
	 * This runs immediately upon purchase and whenever the game loads an upgrade.
	 */
	abstract applyEffect(gameState: GameState): void;

	/**
	 * The requirement to be met for this upgrade to be available.
	 * @param gameState The game state to check against.
	 */
	abstract requirement(gameState: GameState): boolean;

	purchase(gameState: GameState): boolean {
		if (this.isPurchased) {
			console.warn(`Upgrade ${this.id} has already been purchased.`);
			return false;
		}

		const success = gameState.tryTransaction(ResourceIds.Currency, this.cost);
		if (success) {
			this.isPurchased = true;
			this.applyEffect(gameState);
			console.log(`Upgrade ${this.id} purchased.`);
			return true;
		}

		return false;
	}

	save(): UpgradeSaveData {
		return { isPurchased: this.isPurchased };
	}

	load(data: UpgradeSaveData) {
		this.isPurchased = data.isPurchased ?? false;
	}
}
