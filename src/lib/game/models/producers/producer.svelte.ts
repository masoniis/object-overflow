import type { GameState } from '$lib/game/core/game_state.svelte';
import type { Savable } from '$lib/game/core/interfaces';

export interface ProducerSaveData {
	count: number;
	multiplier: number;
}

export class Producer implements Savable<ProducerSaveData> {
	id: string;
	name: string;

	outputResourceId: string;
	costResourceId: string;

	baseCost: number;
	baseProduction: number;

	count = $state(0);
	multiplier = $state(1);

	constructor(
		id: string,
		name: string,
		cost: number,
		production: number,
		options: { output?: string; cost?: string } = {}
	) {
		this.id = id;
		this.name = name;
		this.baseCost = cost;
		this.baseProduction = production;

		this.outputResourceId = options.output ?? 'object';
		this.costResourceId = options.cost ?? 'object';
	}

	get totalProduction() {
		return this.baseProduction * this.count * this.multiplier;
	}

	get currentCost() {
		return Math.floor(this.baseCost * Math.pow(1.15, this.count));
	}

	buy(gameState: GameState) {
		const success = gameState.tryTransaction(this.costResourceId, this.currentCost);

		if (success) {
			this.count += 1;
		}
	}

	save(): ProducerSaveData {
		return { count: this.count, multiplier: this.multiplier };
	}

	load(data: ProducerSaveData) {
		this.count = data.count ?? 0;
		this.multiplier = data.multiplier ?? 1;
	}
}
