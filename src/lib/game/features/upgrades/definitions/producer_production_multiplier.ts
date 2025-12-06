import type { GameState } from '$lib/game/core/state/game_state.svelte';
import type { Producer } from '$lib/game/features/production/producer.svelte';
import { Upgrade, type UpgradeConfig } from '../upgrade.svelte';

export interface ProducerMultiplierConfig extends UpgradeConfig {
	producerId: string;
	multiplier: number;
}

export class ProducerProductionMultiplierUpgrade extends Upgrade {
	producerId: string;
	multiplier: number;

	constructor(config: ProducerMultiplierConfig) {
		super(config);
		this.producerId = config.producerId;
		this.multiplier = config.multiplier;
	}

	applyEffect(gameState: GameState): void {
		const producer = gameState.producers.find((p: Producer) => p.id === this.producerId);
		if (producer) {
			producer.multiplyProduction(this.multiplier);
		} else {
			console.warn(
				`ProducerProductionMultiplierUpgrade: Producer with id ${this.producerId} not found.`
			);
		}
	}

	requirement(gameState: GameState): boolean {
		const producer = gameState.producers.find((p: Producer) => p.id === this.producerId);
		return producer ? producer.count > 0 : false;
	}
}
