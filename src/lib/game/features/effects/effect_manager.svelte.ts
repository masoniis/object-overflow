import type { Effect } from './effect.svelte';
import { ProductionMultiplierEffect } from './definitions/production_multiplier';
import type { GameState } from '$lib/game/core/state/game_state.svelte';

export class EffectManager {
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
}
