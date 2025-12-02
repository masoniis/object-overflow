import { FlatManualClickBonusUpgrade } from '$lib/game/features/upgrades/definitions/flat_manual_click_bonus';
import { GlobalProductionMultiplierUpgrade } from '$lib/game/features/upgrades/definitions/global_production_multiplier';
import { ProducerProductionMultiplierUpgrade } from '$lib/game/features/upgrades/definitions/producer_production_multiplier';
import type { Upgrade } from './upgrade.svelte';

export const INITIAL_UPGRADES: Upgrade[] = [
	new FlatManualClickBonusUpgrade(
		'manual-click-bonus-1',
		'Sharper Finger',
		'Your finger is sharper, you get +1 object per click.',
		100,
		1
	),
	new ProducerProductionMultiplierUpgrade(
		'basic-object-multiplier-1',
		'Basic Object Training',
		'Train your basic objects to be more efficient. Doubles the production of Basic Objects.',
		250,
		'basic_object',
		2
	),
	new GlobalProductionMultiplierUpgrade(
		'global-multiplier-1',
		'Global Boost',
		'Boost all production by 10%.',
		1000,
		1.1
	)
];
