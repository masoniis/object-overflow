import { RandomTriggerSystem } from '../../../core/engine/system/random_trigger_system'; // Adjust import path
import { GoldenObject } from '../interactive/golden_object';
import type { GameState } from '$lib/game/core/state/game_state.svelte';
import { EffectFactory } from '../../effects/effect_factory';
import { ScreenObjectConfig } from '../screen_object_data';

export class SpawnGoldenObjectsSystem extends RandomTriggerSystem {
	constructor(state: GameState) {
		super(
			state,
			ScreenObjectConfig.GoldenObject.spawnMin,
			ScreenObjectConfig.GoldenObject.spawnMax
		);
	}

	protected onTrigger(): void {
		console.log('Golden object spawned!');

		const onCollect = (game: GameState) => {
			const effect = EffectFactory.createRandomTemporaryPositiveEffect();
			console.log('Applying random effect:', effect.name);
			game.effects.add(effect);
		};

		const golden = new GoldenObject(onCollect);
		this.state.screenObjects.add(golden);
	}
}
