import { Producer } from '$lib/game/models/producers/producer.svelte';

export const INITIAL_PRODUCERS = [
	new Producer('basic_object', 'Basic Object', 10, 1),
	new Producer('epic_object', 'Epic Object', 20, 2),
	new Producer('super_epic_object', 'Super Epic Object', 50, 5),
	new Producer('insanely_epic_object', 'Insanely Epic Object', 100, 10)
];
