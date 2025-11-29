import type { GameState } from '$lib/game/core/game_state.svelte';
import { Upgrade } from '../upgrade.svelte';

export class ProducerProductionMultiplierUpgrade extends Upgrade {
	producerId: string;
	multiplier: number;

	constructor(
		id: string,
		name: string,
		description: string,
		cost: number,
		producerId: string,
		multiplier: number
	) {
		super(id, name, description, cost);
		this.producerId = producerId;
		this.multiplier = multiplier;
	}

	onPurchase(gameState: GameState): void {
		const producer = gameState.producers.find((p) => p.id === this.producerId);
		if (producer) {
			producer.multiplier *= this.multiplier;
		} else {
			console.warn(
				`ProducerProductionMultiplierUpgrade: Producer with id ${this.producerId} not found.`
			);
		}
	}

	onLoad(gameState: GameState): void {
		const producer = gameState.producers.find((p) => p.id === this.producerId);
		if (producer) {
			producer.multiplier *= this.multiplier;
		} else {
			console.warn(
				`ProducerProductionMultiplierUpgrade: Producer with id ${this.producerId} not found.`
			);
		}
	}

	requirement(gameState: GameState): boolean {
		const producer = gameState.producers.find((p) => p.id === this.producerId);
		return producer ? producer.count > 0 : false;
	}
}
