import { PlayerResource } from '$lib/game/features/player/player_resource';
import { Producer } from './producer.svelte';

export const ProducerConfig = {
	costScaling: 1.15
} as const;

export enum ProducerIds {
	BasicObject = 'basic_object',
	EpicObject = 'epic_object',
	SuperEpicObject = 'super_epic_object',

	BasicFactory = 'basic_factory',
	AdvancedFactory = 'advanced_factory',
	SuperAdvancedFactory = 'super_advanced_factory',
	UltraAdvancedFactory = 'ultra_advanced_factory',
	ExtremeAdvancedFactory = 'extreme_advanced_factory',

	SelfFactory = 'self_factory',
	UltimateFactory = 'ultimate_object'
}

export const INITIAL_PRODUCERS = [
	new Producer({
		id: ProducerIds.BasicObject,
		name: 'Basic Object',
		cost: 10,
		production: 1,
		outputResourceId: PlayerResource.Currency
	}),
	new Producer({
		id: ProducerIds.EpicObject,
		name: 'Epic Object',
		cost: 100,
		production: 7,
		outputResourceId: PlayerResource.Currency
	}),
	new Producer({
		id: ProducerIds.SuperEpicObject,
		name: 'Super Epic Object',
		cost: 1000,
		production: 20,
		outputResourceId: PlayerResource.Currency
	}),
	new Producer({
		id: ProducerIds.BasicFactory,
		name: 'Basic Object Factory',
		cost: 2000,
		production: 0.1,
		outputResourceId: ProducerIds.BasicObject
	}),
	new Producer({
		id: ProducerIds.AdvancedFactory,
		name: 'Object Factory Factory',
		cost: 5000,
		production: 0.1,
		outputResourceId: ProducerIds.BasicFactory
	}),
	new Producer({
		id: ProducerIds.SuperAdvancedFactory,
		name: 'Object Factory Factory Factory',
		cost: 10000,
		production: 0.1,
		outputResourceId: ProducerIds.AdvancedFactory
	}),
	new Producer({
		id: ProducerIds.UltraAdvancedFactory,
		name: 'Object Factory Factory Factory Factory',
		cost: 20000,
		production: 0.1,
		outputResourceId: ProducerIds.SuperAdvancedFactory
	}),
	new Producer({
		id: ProducerIds.ExtremeAdvancedFactory,
		name: 'Object Factory Factory Factory Factory Factory',
		cost: 100000,
		production: 0.5,
		outputResourceId: ProducerIds.UltraAdvancedFactory
	}),
	new Producer({
		id: ProducerIds.SelfFactory,
		name: 'Self Factory',
		cost: 20000000000000,
		production: 0.1,
		outputResourceId: ProducerIds.SelfFactory
	}),
	new Producer({
		id: ProducerIds.UltimateFactory,
		name: 'Ultimate Factory',
		cost: Infinity,
		production: 1234,
		outputResourceId: ProducerIds.UltraAdvancedFactory
	})
];
