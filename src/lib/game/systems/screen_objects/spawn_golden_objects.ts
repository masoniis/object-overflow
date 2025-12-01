import { RandomTriggerSystem } from '../random_trigger_system'; // Adjust import path
import { GoldenObject } from '../../models/screen_objects/interactive/golden_object';
import { createRandomEffect } from '../../models/effects/effect_factory';
import type { GameState } from '$lib/game/core/game_state.svelte';

export class SpawnGoldenObjectsSystem extends RandomTriggerSystem {
	constructor(state: GameState) {
		// random trigger of 30s to 90s to the parent
		super(state, 30, 90);
	}

	protected onTrigger(): void {
		console.log('Golden object spawned!');

		const onCollect = (game: GameState) => {
			const effect = createRandomEffect();
			console.log('Applying random effect:', effect.name);
			game.addEffect(effect);
		};

		const golden = new GoldenObject(onCollect);
		this.state.addScreenObject(golden);
	}
}
