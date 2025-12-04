import type { GameState } from '$lib/game/core/game_state.svelte';
import type { Savable } from '$lib/game/core/interfaces';

export interface ProducerSaveData {
	count: number;
}

interface ProducerDefinition {
	id: string;
	name: string;
	cost: number;
	production: number;
	outputResourceId?: string;
	costResourceId?: string;
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

	constructor({
		id,
		name,
		cost,
		production,
		outputResourceId = 'object',
		costResourceId = 'object'
	}: ProducerDefinition) {
		this.id = id;
		this.name = name;
		this.baseCost = cost;
		this.baseProduction = production;
		this.outputResourceId = outputResourceId;
		this.costResourceId = costResourceId;
	}

	totalProduction(gameState: GameState) {
		return this.baseProduction * this.count * this.multiplier * gameState.productionMultiplier;
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
		return { count: this.count };
	}

	load(data: ProducerSaveData) {
		this.count = data.count ?? 0;
	}
}
