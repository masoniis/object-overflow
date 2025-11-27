import { ProductionMultiplierEffect } from './definitions/production_multiplier';
import { FlatBonusEffect } from './definitions/flat_bonus';
import type { Effect } from './effect.svelte';

export function createRandomEffect(): Effect {
	const generators: (() => Effect)[] = [
		() =>
			new ProductionMultiplierEffect(
				'golden_production_boost',
				'Golden Production Boost',
				'Boosts production by 2x for 10 seconds!',
				2.0,
				10000
			),
		() =>
			new FlatBonusEffect(
				'golden_flat_bonus',
				'Golden Flat Bonus',
				'Gives a flat bonus of 100 objects!',
				100,
				0
			)
	];

	const generate = generators[Math.floor(Math.random() * generators.length)];
	return generate();
}
