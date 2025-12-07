import { RandomTriggerSystem } from '../../../core/engine/system/random_trigger_system';
import { NefariousObject } from '$lib/game/features/screen_objects/interactive/nefarious_object';
import type { GameState } from '$lib/game/core/state/game_state.svelte';
import { PlayerResource } from '$lib/game/features/player/player_resource';
import { ScreenObjectConfig } from '../screen_object_data';

export class SpawnNefariousObjectsSystem extends RandomTriggerSystem {
	constructor(state: GameState) {
		super(
			state,
			ScreenObjectConfig.NafariousObject.spawnMin,
			ScreenObjectConfig.NafariousObject.spawnMax
		);
	}

	protected onTrigger(): void {
		this.spawnNefariousObject();
	}

	private spawnNefariousObject() {
		console.log('Nefarious object spawned!');

		const onCollect = (game: GameState) => {
			game.modifyResource(
				PlayerResource.Currency,
				-ScreenObjectConfig.NafariousObject.currencyLostOnClick
			);
			console.log('Uh oh! Nefarious object clicked!');

			// spawn two more immediately on click like a hydra
			this.spawnNefariousObject();
			this.spawnNefariousObject();
		};

		const nefarious = new NefariousObject(onCollect);
		this.state.screenObjects.add(nefarious);
	}
}
