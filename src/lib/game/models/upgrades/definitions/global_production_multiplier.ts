import { GameState } from '$lib/game/core/game_state.svelte';
import { ProductionMultiplierEffect } from '$lib/game/models/effects/definitions/production_multiplier';
import { Upgrade } from '../upgrade.svelte';

export class GlobalProductionMultiplierUpgrade extends Upgrade {
	multiplier: number;

	constructor(id: string, name: string, description: string, cost: number, multiplier: number) {
		super(id, name, description, cost);
		this.multiplier = multiplier;
	}

	onPurchase(gameState: GameState): void {
		gameState.addEffect(
			new ProductionMultiplierEffect(
				'prod-mult-from-' + this.id,
				this.name,
				this.description,
				this.multiplier,
				null
			)
		);
	}

	onLoad(gameState: GameState): void {
		gameState.addEffect(
			new ProductionMultiplierEffect(
				'prod-mult-from-' + this.id,
				this.name,
				this.description,
				this.multiplier,
				null
			)
		);
	}

	requirement(_gameState: GameState): boolean {
		// always available if not purchased
		return !this.isPurchased;
	}
}
