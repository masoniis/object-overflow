import type { Effect, EffectSaveData } from './effect.svelte';
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

	get effectList() {
		return this._effectList;
	}

	[Symbol.iterator]() {
		return this.effectList[Symbol.iterator]();
	}

	// INFO: -------------------
	//         modifiers
	// -------------------------

	add(effect: Effect, context: GameState) {
		const existing = this.effectList.find((e) => e.id === effect.id);
		if (existing) {
			return;
		}

		this._effectList.push(effect);
		effect.onApply(context);
	}

	remove(effect: Effect, context: GameState) {
		const index = this._effectList.indexOf(effect);
		if (index > -1) {
			this._effectList.splice(index, 1);
			effect.onRemove(context);
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

	public load(data: EffectManagerSaveData, context: GameState): void {
		// load transient effects
		// persistent effects will be re-added by their owners (e.g., upgrades on load)
		for (const entry of data) {
			const effect = EffectFactory.fromSaveData(entry);
			if (effect) {
				this.add(effect, context);
			}
		}
	}
}
