import { GameSystem } from '../abstract_gamesystem.js';

export class ApplyProductionSystem extends GameSystem {
	tick(dt: number) {
		let producers = this.state.producers;

		// get production
		let rate = 0;
		for (const p of producers) {
			rate += p.totalProduction;
		}

		// update global state
		this.state.addObjects(rate * dt);
	}
}
