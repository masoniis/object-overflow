import { RandomTriggerSystem } from '../../../core/engine/system/random_trigger_system';
import { NefariousObject } from '$lib/game/features/screen_objects/interactive/nefarious_object';
import type { GameState } from '$lib/game/core/state/game_state.svelte';
import { PlayerResource } from '$lib/game/features/player/player_resource';

export class SpawnNefariousObjectsSystem extends RandomTriggerSystem {
	private static OBJECTS_LOST_ON_CLICK = 500;

	constructor(state: GameState) {
		// random trigger between 16s and 51s
		super(state, 16, 51);
	}

	protected onTrigger(): void {
		this.spawnNefariousObject();
	}

	private spawnNefariousObject() {
		console.log('Nefarious object spawned!');

		const onCollect = (game: GameState) => {
			game.modifyResource(
				PlayerResource.Currency,
				-SpawnNefariousObjectsSystem.OBJECTS_LOST_ON_CLICK
			);
			console.log('Uh oh! Nefarious object clicked!');

			// Spawn two more immediately on click
			this.spawnNefariousObject();
			this.spawnNefariousObject();
		};

		const nefarious = new NefariousObject(onCollect);
		this.state.screenObjects.add(nefarious);
	}
}
