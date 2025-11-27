import type { Tickable } from './tickable_interface.ts';
import type { GameState } from '../game_state.svelte';
import type { Producer } from '../Producer.svelte';

export class UpdateProductionTickable implements Tickable {
	constructor(private state: GameState) {
		if (!state) {
			throw new Error('ProducerSystem requires GameState!');
		}
	}

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
