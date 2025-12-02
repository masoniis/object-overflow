import { ResourceIds } from '$lib/game/core/state/constants';
import type { GameState } from '$lib/game/core/state/game_state.svelte';

export interface ProducerSaveData {
	count: number;
}

export interface ProducerDefinition {
	id: string;
	name: string;
	cost: number;
	production: number;
	outputResourceId?: string;
	costResourceId?: string;
}

export class Producer {
	// INFO: ----------------
	//         config
	// ----------------------

	// identity
	public readonly id: string;
	public readonly name: string;

	// economy links
	public readonly outputResourceId: string;
	public readonly costResourceId: string;

	// balancing
	public readonly baseCost: number;
	public readonly baseProduction: number;

	// INFO: ---------------
	//         state
	// ---------------------

	public count = $state(0);
	public multiplier = $state(1);

	constructor({
		id,
		name,
		cost,
		production,
		outputResourceId = ResourceIds.Currency,
		costResourceId = ResourceIds.Currency
	}: ProducerDefinition) {
		this.id = id;
		this.name = name;
		this.baseCost = cost;
		this.baseProduction = production;
		this.outputResourceId = outputResourceId;
		this.costResourceId = costResourceId;
	}

	// INFO: -----------------
	//         getters
	// -----------------------

	/**
	 * Calculates the current purchase price based on exponential scaling.
	 */
	get currentCost(): number {
		return Math.floor(this.baseCost * Math.pow(1.15, this.count));
	}

	/**
	 * Calculates production per tick/second for this specific producer type.
	 */
	public totalProduction(productionMultiplier: number): number {
		return this.baseProduction * this.count * this.multiplier * productionMultiplier;
	}

	// INFO: -----------------
	//         actions
	// -----------------------

	public buy(gameState: GameState): void {
		const success = gameState.tryTransaction(this.costResourceId, this.currentCost);

		if (success) {
			this.count += 1;
		}
	}

	// INFO: ----------------------
	//         saving logic
	// ----------------------------

	public save(): ProducerSaveData {
		return { count: this.count };
	}

	public load(data: ProducerSaveData): void {
		this.count = data.count ?? 0;
	}
}
