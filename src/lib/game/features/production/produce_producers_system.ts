import { System } from '../../core/engine/system/system';

export class ProduceProducersSystem extends System {
	tick(delta_seconds: number) {
		let productionMultiplier = this.state.effects.getGlobalProductionMultiplier();

		for (const producer of this.state.producers) {
			if (producer.count > 0) {
				const amount = producer.totalProduction(productionMultiplier) * delta_seconds;

				this.state.modifyResource(producer.outputResourceId, amount);
			}
		}
	}
}
