import { Effect } from '../effect.svelte';

// TODO: this effect with no body is a code smell suggesting the abstract effect
// class is too general
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
