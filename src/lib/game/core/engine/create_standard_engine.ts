import { GameEngine } from '$lib/game/core/engine/game_engine.svelte';
import { ProduceProducersSystem } from '../../features/production/produce_producers_system';
import { ProduceCurrencySystem } from '../../features/production/produce_currency_system';
import { SpawnGoldenObjectsSystem } from '../../features/screen_objects/systems/spawn_golden_objects';
import { ScreenObjectLifecycleSystem } from '../../features/screen_objects/systems/expire_screen_objects';
import { SpawnNefariousObjectsSystem } from '../../features/screen_objects/systems/spawn_nefarious_objects';
import { AutosaveSystem } from '../../features/persistence/autosave_system';
import type { GameState } from '../state/game_state.svelte';
import { ProcessEffectsSystem } from '$lib/game/features/effects/process_effects_system';

export function createStandardEngine(state: GameState): GameEngine {
	const engine = new GameEngine();

	engine
		.addSystem(new ProcessEffectsSystem(state))
		.addSystem(new ProduceCurrencySystem(state))
		.addSystem(new ProduceProducersSystem(state))
		.addSystem(new SpawnNefariousObjectsSystem(state))
		.addSystem(new SpawnGoldenObjectsSystem(state))
		.addSystem(new ScreenObjectLifecycleSystem(state))
		.addSystem(new AutosaveSystem(state));

	return engine;
}
