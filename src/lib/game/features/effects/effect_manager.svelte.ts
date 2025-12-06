import type { Effect, EffectSaveData } from './effect';
import { ProductionMultiplierEffect } from './definitions/production_multiplier';
import type { GameState } from '$lib/game/core/state/game_state.svelte';
import type { Savable } from '$lib/game/features/persistence/savable';
import { EffectFactory } from './effect_factory';

export type EffectManagerSaveData = EffectSaveData[];

export class EffectManager implements Savable<EffectManagerSaveData, GameState> {
	private _effectList: Effect[] = $state([]);

	// INFO: -----------------
	//         getters
	// -----------------------

	get length() {
		return this._effectList.length;
	}

	[Symbol.iterator]() {
		return this._effectList[Symbol.iterator]();
	}

	// INFO: -------------------
	//         modifiers
	// -------------------------

	add(effect: Effect) {
		const existing = this._effectList.find((e) => e.id === effect.id);
		if (existing) {
			return;
		}

		this._effectList.push(effect);
	}

	remove(effect: Effect) {
		const index = this._effectList.indexOf(effect);
		if (index > -1) {
			this._effectList.splice(index, 1);
		}
	}

	// INFO: ---------------
	//         utils
	// ---------------------

	/**
	 * Calculates the aggregated production multiplier from all active effects.
	 */
	getGlobalProductionMultiplier(): number {
		return this._effectList.reduce((acc, effect) => {
			if (effect instanceof ProductionMultiplierEffect) {
				return acc * effect.multiplier;
			}
			return acc;
		}, 1);
	}

	// INFO: -----------------------
	//         savable logic
	// -----------------------------

	public readonly saveKey = 'effects';

	public save(): EffectManagerSaveData {
		// only save non-persistent effects (transient effects)
		return this._effectList
			.filter((effect) => effect.shouldBeSaved)
			.map((effect) => ({
				id: effect.id,
				type: effect.type,
				data: effect.saveData()
			}));
	}

	public reset() {
		// clear all effects before loading
		this._effectList = [];
	}

	public load(data: EffectManagerSaveData): void {
		// load transient effects
		// persistent effects will be re-added by their owners (e.g., upgrades on load)
		for (const entry of data) {
			const effect = EffectFactory.fromSaveData(entry);
			if (effect) {
				this.add(effect);
			}
		}
	}
}
