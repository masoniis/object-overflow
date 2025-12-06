import { PlayerResource } from '$lib/game/features/player/player_resource';
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

	private _count = $state(0);
	private _multiplier = $state(1);

	constructor({
		id,
		name,
		cost,
		production,
		outputResourceId = PlayerResource.Currency,
		costResourceId = PlayerResource.Currency
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

	get count() {
		return this._count;
	}

	get multiplier() {
		return this._multiplier;
	}

	/**
	 * Calculates the current purchase price based on exponential scaling.
	 */
	get currentCost(): number {
		return Math.floor(this.baseCost * Math.pow(1.15, this._count));
	}

	/**
	 * Calculates production per tick/second for this specific producer type.
	 */
	public totalProduction(productionMultiplier: number): number {
		return this.baseProduction * this._count * this._multiplier * productionMultiplier;
	}

	// INFO: -----------------
	//         actions
	// -----------------------

	public addCount(amount: number) {
		this._count += amount;
	}

	public multiplyProduction(factor: number) {
		this._multiplier *= factor;
	}

	public buy(gameState: GameState): void {
		const success = gameState.tryTransaction(this.costResourceId, this.currentCost);

		if (success) {
			this._count += 1;
		}
	}

	// INFO: ----------------------
	//         saving logic
	// ----------------------------

	public save(): ProducerSaveData {
		return { count: this._count };
	}

	public reset() {
		this._multiplier = 1;
	}

	public load(data: ProducerSaveData): void {
		this._count = data.count ?? 0;
	}
}
