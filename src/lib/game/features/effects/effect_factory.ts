import { ProductionMultiplierEffect } from './definitions/production_multiplier';
import type { Effect, EffectSaveData } from './effect';

export class EffectFactory {
	private static MIN_POSITIVE_RANDOM_EFFECT_MULTIPLIER = 2;
	private static MAX_POSITIVE_RANDOM_EFFECT_MULTIPLIER = 10;
	private static DEFAULT_TEMPORARY_EFFECT_DURATION_MS = 10000;

	/**
	 * Creates a new random effect (for golden objects, events, etc)
	 */
	static createRandomTemporaryPositiveEffect(): Effect {
		const DURATION = EffectFactory.DEFAULT_TEMPORARY_EFFECT_DURATION_MS;
		const uniqueId = crypto.randomUUID();

		const min_mult = EffectFactory.MIN_POSITIVE_RANDOM_EFFECT_MULTIPLIER;
		const max_mult = EffectFactory.MAX_POSITIVE_RANDOM_EFFECT_MULTIPLIER;

		// get a random mult between min and max
		const multiplier = Math.floor(Math.random() * (max_mult - min_mult + 1)) + min_mult;

		return new ProductionMultiplierEffect({
			id: `random_prod_effect_${uniqueId}`,
			name: 'Golden Production Boost',
			description: `Boosts production by ${multiplier}x for ${DURATION / 1000} seconds!`,
			duration: DURATION,
			multiplier: multiplier,
			shouldBeSaved: true
		});
	}

	/**
	 * Creates an effect that is persistent and lasts forever
	 */
	static createPersistentMultiplierEffect(
		id: string,
		name: string,
		description: string,
		multiplier: number
	): Effect {
		return new ProductionMultiplierEffect({
			id: id,
			name: name,
			description: description,
			duration: Infinity, // infinite aka persistent
			multiplier: multiplier,
			shouldBeSaved: false
		});
	}

	// INFO: ------------------------------------
	//         creating effects from save
	// ------------------------------------------

	private static registry = new Map<string, (id: string, data: any) => Effect>([
		['production_multiplier', ProductionMultiplierEffect.fromSaveData]
	]);

	/**
	 * Recreates an effect from save data
	 */
	static fromSaveData(saveData: EffectSaveData): Effect {
		const creator = this.registry.get(saveData.type);
		if (!creator) {
			throw new Error(`Unknown effect type: ${saveData.type}`);
		}
		return creator(saveData.id, saveData.data);
	}
}
