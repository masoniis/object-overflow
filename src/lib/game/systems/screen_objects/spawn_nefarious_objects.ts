import { GameState } from '$lib/game/core/game_state.svelte';
import { GameSystem } from '../abstract_gamesystem';
import { NefariousObject } from '$lib/game/models/screen_objects/nefarious_object';

export class SpawnNefariousObjectsSystem extends GameSystem {
	private timeToNextSpawn = this.getRandomSpawnTime();

	tick(dt: number) {
		this.timeToNextSpawn -= dt * 1000;

		if (this.timeToNextSpawn <= 0) {
			this.spawnNefariousObject();
			this.timeToNextSpawn = this.getRandomSpawnTime();
		}
	}

	private getRandomSpawnTime(): number {
		return Math.random() * 35000 + 16000;
	}

	private spawnNefariousObject() {
		console.log('Nefarious object spawned!');

		// collection logic
		const onCollect = (game: GameState) => {
			game.modifyResource('object', -500);
			console.log('Uh oh! Nefarious object clicked!');
			this.spawnNefariousObject();
			this.spawnNefariousObject();
		};

		// instantiate and add
		const nefarious = new NefariousObject(onCollect);
		this.state.addScreenObject(nefarious);
	}
}
