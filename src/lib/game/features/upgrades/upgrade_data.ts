import { FlatManualClickBonusUpgrade } from '$lib/game/features/upgrades/definitions/flat_manual_click_bonus';
import { GlobalProductionMultiplierUpgrade } from '$lib/game/features/upgrades/definitions/global_production_multiplier';
import { ProducerProductionMultiplierUpgrade } from '$lib/game/features/upgrades/definitions/producer_production_multiplier';
import { ProducerIds } from '../production/producer_data';
import { LifetimeEarningsUpgradeRequirement } from './requirements/currency_upgrade_requirement';
import { OtherUpgradeFirstRequirement } from './requirements/previous_upgrade_requirement';
import type { Upgrade } from './upgrade.svelte';

export const INITIAL_UPGRADES: Upgrade[] = [
	// flat click upgrades
	new FlatManualClickBonusUpgrade({
		id: 'flat-manual-click-bonus-1',
		name: 'Sharper Finger',
		description: 'Your finger is sharper, you get +1 object per click.',
		cost: 100,
		bonus: 1
	}),
	new FlatManualClickBonusUpgrade({
		id: 'flat-manual-click-bonus-2',
		name: 'Sharper Finger',
		description: 'Your finger is sharper, you get +10 objects per click.',
		cost: 1000,
		bonus: 10,
		requirements: [new LifetimeEarningsUpgradeRequirement(10000)]
	}),

	// specific producer upgrades
	new ProducerProductionMultiplierUpgrade({
		id: 'basic-object-multiplier-1',
		name: 'Basic Object Training',
		description: 'Doubles the production of Basic Objects.',
		cost: 250,
		producerId: ProducerIds.BasicObject,
		multiplier: 2
	}),

	// global prod multipliers
	new GlobalProductionMultiplierUpgrade({
		id: 'global-multiplier-1',
		name: 'Global Boost I',
		description: 'Boost all production by 10%.',
		cost: 1000,
		multiplier: 1.1
	}),
	new GlobalProductionMultiplierUpgrade({
		id: 'global-multiplier-2',
		name: 'Global Boost II',
		description: 'Boost all production by 10%.',
		cost: 10000,
		multiplier: 1.1,
		requirements: [new OtherUpgradeFirstRequirement('global-multiplier-1')]
	}),
	new GlobalProductionMultiplierUpgrade({
		id: 'global-multiplier-3',
		name: 'Global Boost III',
		description: 'Boost all production by 10%.',
		cost: 100000,
		multiplier: 1.1,
		requirements: [new OtherUpgradeFirstRequirement('global-multiplier-2')]
	}),

	new GlobalProductionMultiplierUpgrade({
		id: 'global-multiplier-4',
		name: 'Global Boost IV',
		description: 'Boost all production by 10%.',
		cost: 1000000,
		multiplier: 1.1,
		requirements: [new OtherUpgradeFirstRequirement('global-multiplier-3')]
	})
];
