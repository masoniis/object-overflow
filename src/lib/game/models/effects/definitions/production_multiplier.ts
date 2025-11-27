import { Effect } from '../effect.svelte';

export class ProductionMultiplierEffect extends Effect {
	constructor(
		id: string,
		name: string,
		description: string,
		public multiplier: number,
		duration: number | null
	) {
		super(id, name, description, duration);
	}
}
