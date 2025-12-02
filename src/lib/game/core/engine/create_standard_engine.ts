import { GameEngine } from '$lib/game/core/engine/game_engine.svelte';
import { ProducerProductionSystem } from '../../systems/definitions/producer_production';
import { ApplyProductionSystem } from '../../systems/definitions/apply_production';
import { AutosaveSystem } from '../../systems/definitions/autosave';
import { SpawnGoldenObjectsSystem } from '../../systems/screen_objects/spawn_golden_objects';
import { ProcessEffectsSystem } from '../../systems/definitions/process_effects';
import { ScreenObjectLifecycleSystem } from '../../systems/screen_objects/expire_screen_objects';
import { SpawnNefariousObjectsSystem } from '../../systems/screen_objects/spawn_nefarious_objects';
import type { GameState } from '../state/game_state.svelte';

export function createStandardEngine(state: GameState): GameEngine {
	const engine = new GameEngine();

	engine
		.addSystem(new ApplyProductionSystem(state))
		.addSystem(new ProducerProductionSystem(state))
		.addSystem(new AutosaveSystem(state))
		.addSystem(new ProcessEffectsSystem(state))
		.addSystem(new ScreenObjectLifecycleSystem(state))
		.addSystem(new SpawnNefariousObjectsSystem(state))
		.addSystem(new SpawnGoldenObjectsSystem(state));

	return engine;
}
