import { PlayerResource } from '$lib/game/features/player/player_resource';
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
	public readonly id: string;
	public readonly name: string;
	public readonly description: string;
	public readonly cost: number;
	public readonly requirements: UpgradeRequirement[] = [];

	constructor({ id, name, description, cost, requirements = [] }: UpgradeConfig) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.cost = cost;
		this.requirements = requirements;
	}

	private _isPurchased = $state(false);

	get isPurchased() {
		return this._isPurchased;
	}

	/**
	 * The core logic on how to apply the upgrade.
	 */
	abstract applyEffect(gameState: GameState): void;

	/**
	 * Checks if the requirements of an upgrade are met.
	 */
	requirementsMet(gameState: GameState): boolean {
		if (this._isPurchased) return false;
		return this.requirements.every((req) => req.isMet(gameState));
	}

	purchase(gameState: GameState): boolean {
		if (this._isPurchased) {
			console.warn(`Upgrade ${this.id} has already been purchased.`);
			return false;
		}

		const success = gameState.tryTransaction(PlayerResource.Currency, this.cost);
		if (success) {
			this._isPurchased = true;
			this.applyEffect(gameState);
			console.log(`Upgrade ${this.id} purchased.`);
			return true;
		}

		return false;
	}

	save(): UpgradeSaveData {
		return { isPurchased: this._isPurchased };
	}

	load(data: UpgradeSaveData) {
		this._isPurchased = data.isPurchased ?? false;
	}
}
