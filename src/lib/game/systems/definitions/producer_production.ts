import { System } from '../system';

export class ProducerProductionSystem extends System {
	tick(delta_seconds: number) {
		for (const producer of this.state.producers) {
			if (producer.count > 0) {
				const amount = producer.totalProduction(this.state) * delta_seconds;

				this.state.modifyResource(producer.outputResourceId, amount);
			}
		}
	}
}
