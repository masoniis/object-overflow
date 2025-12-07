import type { Savable } from '$lib/game/features/persistence/savable';
import { PlayerResource } from '$lib/game/features/player/player_resource';
import type { ResourceProvider } from '$lib/game/core/state/resource_provider';
import type { Producer, ProducerSaveData } from './producer.svelte';
import { INITIAL_PRODUCERS } from './producer_data';

export type ProducerManagerSaveData = {
	id: string;
	data: ProducerSaveData;
}[];

export class ProducerManager implements ResourceProvider, Savable {
	private _producerList: Producer[];

	constructor(initialProducers: Producer[] = INITIAL_PRODUCERS) {
		this._producerList = $state([...initialProducers]);
	}

	// INFO: -----------------
	//         getters
	// -----------------------

	get length() {
		return this._producerList.length;
	}

	public getById(id: string): Producer | undefined {
		return this._producerList.find((p) => p.id === id);
	}

	[Symbol.iterator]() {
		return this._producerList[Symbol.iterator]();
	}

	public find(predicate: (producer: Producer) => boolean): Producer | undefined {
		return this._producerList.find(predicate);
	}

	public filter(predicate: (producer: Producer) => boolean): Producer[] {
		return this._producerList.filter(predicate);
	}

	public computeTotalProduction(globalProductionMultiplier: number): number {
		return this._producerList.reduce((total, producer) => {
			if (producer.outputResourceId === PlayerResource.Currency) {
				return total + producer.totalProduction(globalProductionMultiplier);
			}
			return total;
		}, 0);
	}

	// INFO: ---------------------------------
	//         resource-provider logic
	// ---------------------------------------

	ownsResource(id: string): boolean {
		return this.getById(id) !== undefined;
	}

	getResourceAmount(id: string): number {
		return this.getById(id)?.count ?? 0;
	}

	modifyResource(id: string, amount: number): void {
		const producer = this.getById(id);
		if (producer) {
			producer.addCount(amount);
		}
	}

	// INFO: --------------------
	//         save logic
	// --------------------------

	public readonly saveKey = 'producers';

	save(): ProducerManagerSaveData {
		return this._producerList.map((p) => ({
			id: p.id,
			data: p.save()
		}));
	}

	reset(): void {
		for (const producer of this._producerList) {
			producer.reset();
		}
	}

	load(data: ProducerManagerSaveData): void {
		for (const entry of data) {
			const producer = this.getById(entry.id);
			if (producer) {
				producer.load(entry.data);
			}
		}
	}
}
