import { GameSystem } from '../abstract_gamesystem';

export class ProducerProductionSystem extends GameSystem {
	tick(dt: number) {
		const globalMult = this.state.productionMultiplier;

		for (const producer of this.state.producers) {
			if (producer.count > 0) {
				const amount = producer.totalProduction * globalMult * dt;

				this.state.modifyResource(producer.outputResourceId, amount);
			}
		}
	}
}
