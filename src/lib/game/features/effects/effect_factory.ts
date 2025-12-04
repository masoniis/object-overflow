import { ProductionMultiplierEffect } from './definitions/production_multiplier';
import type { Effect } from './effect.svelte';
import type { EffectSaveData } from './effect.svelte';

export class EffectFactory {
	/**
	 * Creates a new random effect (for golden objects, events, etc)
	 */
	static createRandomTemporaryEffect(): Effect {
		const DURATION = 10000;
		const uniqueId = crypto.randomUUID();

		const generators: (() => Effect)[] = [
			() =>
				new ProductionMultiplierEffect({
					id: `random_prod_effect_${uniqueId}`,
					name: 'Golden Production Boost',
					description: 'Boosts production by 2x for 10 seconds!',
					duration: DURATION,
					multiplier: 2.0,
					shouldBeSaved: true
				})
		];

		const generate = generators[Math.floor(Math.random() * generators.length)];
		return generate();
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
