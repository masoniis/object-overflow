import { Producer } from '$lib/game/models/producers/producer.svelte';

export const INITIAL_PRODUCERS = [
	new Producer({
		id: 'basic_object',
		name: 'Basic Object',
		cost: 10,
		production: 1,
		outputResourceId: 'object'
	}),
	new Producer({
		id: 'epic_object',
		name: 'Epic Object',
		cost: 100,
		production: 7,
		outputResourceId: 'object'
	}),
	new Producer({
		id: 'super_epic_object',
		name: 'Super Epic Object',
		cost: 1000,
		production: 20,
		outputResourceId: 'object'
	}),
	new Producer({
		id: 'basic_factory',
		name: 'Basic Object Factory',
		cost: 2000,
		production: 0.1,
		outputResourceId: 'basic_object'
	}),
	new Producer({
		id: 'advanced_factory',
		name: 'Object Factory Factory',
		cost: 5000,
		production: 0.1,
		outputResourceId: 'basic_factory'
	}),
	new Producer({
		id: 'super_advanced_factory',
		name: 'Object Factory Factory Factory',
		cost: 10000,
		production: 0.1,
		outputResourceId: 'advanced_factory'
	}),
	new Producer({
		id: 'ultra_advanced_factory',
		name: 'Object Factory Factory Factory Factory',
		cost: 20000,
		production: 0.1,
		outputResourceId: 'super_advanced_factory'
	}),
	new Producer({
		id: 'extreme_advanced_factory',
		name: 'Object Factory Factory Factory Factory Factory',
		cost: 100000,
		production: 0.5,
		outputResourceId: 'ultra_advanced_factory'
	}),
	new Producer({
		id: 'self_factory',
		name: 'Self Factory',
		cost: 20000000000000,
		production: 0.1,
		outputResourceId: 'self_factory'
	}),
	new Producer({
		id: 'ultimate_object',
		name: 'Ultimate Factory',
		cost: Infinity,
		production: 1234,
		outputResourceId: 'ultra_advanced_factory'
	})
];
