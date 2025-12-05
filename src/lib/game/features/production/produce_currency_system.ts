import { System } from '../../core/engine/system/system.ts';
import { ProductionMultiplierEffect } from '../effects/definitions/production_multiplier.ts';
import { PlayerResource } from '../player/player_resource.ts';

export class ProduceCurrencySystem extends System {
	tick(delta_seconds: number) {
		const producers = this.state.producers;

		// get production
		let rate = 0;
		for (const p of producers) {
			rate += p.totalProduction(this.state.effects.getGlobalProductionMultiplier());
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
		this.state.modifyResource(PlayerResource.Currency, rate * delta_seconds);
	}
}
