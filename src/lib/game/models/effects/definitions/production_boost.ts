import { Effect } from '../effect.svelte';

export class ProductionBoostEffect extends Effect {
	id = 'production-boost';
	name = 'Production Boost';
	description = 'Doubles your production for 10 seconds.';
	duration = 10000; // 10 seconds

	get productionMultiplier(): number {
		return 2;
	}
}
