import { GameState } from '$lib/game/game_state.svelte.js';
import type { Savable } from '$lib/game/interfaces.ts';

export interface ProducerSaveData {
	count: number;
	multiplier: number;
}

export class Producer implements Savable<ProducerSaveData> {
	id: string;
	name: string;
	baseCost: number;
	baseProduction: number;

	count = $state(0);
	multiplier = $state(1);

	constructor(id: string, name: string, cost: number, production: number) {
		this.id = id;
		this.name = name;
		this.baseCost = cost;
		this.baseProduction = production;
	}

	get totalProduction() {
		return this.baseProduction * this.count * this.multiplier;
	}

	get currentCost() {
		return Math.floor(this.baseCost * Math.pow(1.15, this.count));
	}

	buy(gameState: GameState) {
		gameState.removeObjects(this.currentCost);
		this.count += 1;
	}

	// INFO: -----------------------
	//         savable logic
	// -----------------------------

	save(): ProducerSaveData {
		return {
			count: this.count,
			multiplier: this.multiplier
		};
	}

	load(data: ProducerSaveData) {
		this.count = data.count ?? 0;
		this.multiplier = data.multiplier ?? 1;
	}
}
