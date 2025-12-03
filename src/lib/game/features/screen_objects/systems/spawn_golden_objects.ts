import { RandomTriggerSystem } from '../../../core/engine/system/random_trigger_system'; // Adjust import path
import { GoldenObject } from '../interactive/golden_object';
import type { GameState } from '$lib/game/core/state/game_state.svelte';
import { EffectFactory } from '../../effects/effect_factory';

export class SpawnGoldenObjectsSystem extends RandomTriggerSystem {
	constructor(state: GameState) {
		// random trigger of 30s to 90s to the parent
		super(state, 3, 9);
	}

	protected onTrigger(): void {
		console.log('Golden object spawned!');

		const onCollect = (game: GameState) => {
			const effect = EffectFactory.createRandomTemporaryEffect();
			console.log('Applying random effect:', effect.name);
			game.addEffect(effect);
		};

		const golden = new GoldenObject(onCollect);
		this.state.screenObjects.add(golden);
	}
}
