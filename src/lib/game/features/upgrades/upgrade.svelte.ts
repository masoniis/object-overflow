import { ResourceIds } from '$lib/game/core/state/constants';
import type { GameState } from '$lib/game/core/state/game_state.svelte';
import type { UpgradeRequirement } from './requirements/upgrade_requirement';

export interface UpgradeConfig {
	id: string;
	name: string;
	description: string;
	cost: number;
	requirements?: UpgradeRequirement[];
}

export interface UpgradeSaveData {
	isPurchased: boolean;
}

export abstract class Upgrade {
	id: string;
	name: string;
	description: string;
	cost: number;
	requirements: UpgradeRequirement[] = [];

	constructor({ id, name, description, cost, requirements = [] }: UpgradeConfig) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.cost = cost;
		this.requirements = requirements;
	}

	isPurchased = $state(false);

	/**
	 * The core logic of the upgrade.
	 * This runs immediately upon purchase and whenever the game loads an upgrade.
	 */
	abstract applyEffect(gameState: GameState): void;

	/**
	 * Checks if the requirements of an upgrade are met.
	 */
	requirementsMet(gameState: GameState): boolean {
		if (this.isPurchased) return false;
		return this.requirements.every((req) => req.isMet(gameState));
	}

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
