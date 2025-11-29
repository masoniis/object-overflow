import { GameSystem } from '../abstract_gamesystem';

export class ProducerProductionSystem extends GameSystem {
	tick(dt: number) {
		for (const producer of this.state.producers) {
			if (producer.count > 0) {
				const amount = producer.totalProduction(this.state) * dt;

				this.state.modifyResource(producer.outputResourceId, amount);
			}
		}
	}
}
