import { GameSystem } from '../abstract_gamesystem.ts';
import { ProductionMultiplierEffect } from '$lib/game/models/effects/definitions/production_multiplier';

export class ApplyProductionSystem extends GameSystem {
	tick(delta_seconds: number) {
		const producers = this.state.producers;

		// get production
		let rate = 0;
		for (const p of producers) {
			rate += p.totalProduction(this.state);
		}

		// get all effects
		const effects = this.state.effects;

		// calc multiplier
		let multiplier = 1;
		for (const effect of effects) {
			if (effect instanceof ProductionMultiplierEffect) {
				multiplier *= effect.multiplier;
			}
		}

		// apply multipliers
		rate *= multiplier;

		// update global state
		this.state.modifyResource('object', rate * delta_seconds);
	}
}
