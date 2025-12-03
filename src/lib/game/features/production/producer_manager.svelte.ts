import type { Savable } from '$lib/game/core/save/savable';
import { ResourceIds } from '$lib/game/core/state/constants';
import type { Producer, ProducerSaveData } from './producer.svelte';
import { INITIAL_PRODUCERS } from './producer_data';

export type ProducerManagerSaveData = {
	id: string;
	data: ProducerSaveData;
}[];

export class ProducerManager implements Savable {
	private _producerList: Producer[] = $state([...INITIAL_PRODUCERS]);

	// INFO: -----------------
	//         getters
	// -----------------------

	get producerList() {
		return this._producerList;
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
		return this.producerList.reduce((total, producer) => {
			if (producer.outputResourceId === ResourceIds.Currency) {
				return total + producer.totalProduction(globalProductionMultiplier);
			}
			return total;
		}, 0);
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
		for (const producer of this.producerList) {
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
