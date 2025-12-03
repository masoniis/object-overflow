import { Producer } from '$lib/game/models/producers/producer.svelte';

export const INITIAL_PRODUCERS = [
	new Producer('basic_object', 'Basic Object', 10, 1, { output: 'object' }),
	new Producer('epic_object', 'Epic Object', 100, 7, { output: 'object' }),
	new Producer('super_epic_object', 'Super Epic Object', 1000, 20, { output: 'object' }),
	new Producer('basic_factory', 'Basic Object Factory', 2000, 0.1, { output: 'basic_object' }),
	new Producer('advanced_factory', 'Object Factory Factory', 5000, 0.1, {
		output: 'basic_factory'
	}),
	new Producer('super_advanced_factory', 'Object Factory Factory Factory', 10000, 0.1, {
		output: 'advanced_factory'
	}),
	new Producer('ultra_advanced_factory', 'Object Factory Factory Factory Factory', 20000, 0.1, {
		output: 'super_advanced_factory'
	}),
	new Producer(
		'extreme_advanced_factory',
		'Object Factory Factory Factory Factory Factory',
		100000,
		0.5,
		{
			output: 'ultra_advanced_factory'
		}
	),
	new Producer('self_factory', 'Self Factory', 20000000000000, 0.1, {
		output: 'self_factory'
	}),
	new Producer('ultimate_object', 'Ultimate Factory', Infinity, 1234, {
		output: 'ultra_advanced_factory'
	})
];
