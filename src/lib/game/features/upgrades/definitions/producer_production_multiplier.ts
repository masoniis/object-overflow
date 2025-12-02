import type { GameState } from '$lib/game/core/state/game_state.svelte';
import type { Producer } from '$lib/game/features/production/producer.svelte';
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

	applyEffect(gameState: GameState): void {
		const producer = gameState.producers.find((p: Producer) => p.id === this.producerId);
		if (producer) {
			producer.multiplier *= this.multiplier;
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
