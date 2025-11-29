import { GameState } from '$lib/game/core/game_state.svelte';
import { GameSystem } from '../abstract_gamesystem';
import { GoldenObject } from '../../models/screen_objects/golden_object';
import { createRandomEffect } from '../../models/effects/effect_factory';

export class SpawnGoldenObjectsSystem extends GameSystem {
	private timeToNextSpawn = this.getRandomSpawnTime();

	tick(dt: number) {
		this.timeToNextSpawn -= dt * 1000;

		if (this.timeToNextSpawn <= 0) {
			this.spawnGoldenObject();
			this.timeToNextSpawn = this.getRandomSpawnTime();
		}
	}

	private getRandomSpawnTime(): number {
		return Math.random() * 30000 + 6000;
	}

	private spawnGoldenObject() {
		console.log('Golden object spawned!');

		// collection logic
		const onCollect = (game: GameState) => {
			const effect = createRandomEffect();
			console.log('Applying random effect:', effect.name);
			game.addEffect(effect);
		};

		// instantiate and add
		const golden = new GoldenObject(onCollect);
		this.state.addScreenObject(golden);
	}
}
