import { GameSystem } from '../abstract_gamesystem.ts';

export class ApplyProductionSystem extends GameSystem {
	tick(dt: number) {
		let producers = this.state.producers;

		// get production
		let rate = 0;
		for (const p of producers) {
			rate += p.totalProduction;
		}

		// get all effects
		let effects = this.state.effects;

		// calc multiplier
		let multiplier = 1;
		for (const effect of effects) {
			multiplier *= effect.productionMultiplier ?? 1;
		}

		// apply multipliers
		rate *= multiplier;

		// update global state
		this.state.addObjects(rate * dt);
	}
}
