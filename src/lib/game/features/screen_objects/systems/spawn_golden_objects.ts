import { RandomTriggerSystem } from '../../../core/engine/system/random_trigger_system'; // Adjust import path
import { GoldenObject } from '../interactive/golden_object';
import type { GameState } from '$lib/game/core/state/game_state.svelte';
import { EffectFactory } from '../../effects/effect_factory';

export class SpawnGoldenObjectsSystem extends RandomTriggerSystem {
	private static readonly MIN_SPAWN_INTERVAL_SEC = 15;
	private static readonly MAX_SPAWN_INTERVAL_SEC = 29;

	constructor(state: GameState) {
		super(
			state,
			SpawnGoldenObjectsSystem.MIN_SPAWN_INTERVAL_SEC,
			SpawnGoldenObjectsSystem.MAX_SPAWN_INTERVAL_SEC
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
