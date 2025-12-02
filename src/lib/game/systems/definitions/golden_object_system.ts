import { GameState } from '$lib/game/core/game_state.svelte';
import { GameSystem } from '../abstract_gamesystem';
import { ProductionBoostEffect } from '../../models/effects/definitions/production_boost';
import { FlatBonusEffect } from '../../models/effects/definitions/flat_bonus';
import { GoldenObject } from '../../models/screen_objects/golden_object';

export class GoldenObjectSystem extends GameSystem {
	private timeToNextSpawn = this.getRandomSpawnTime();

	tick(dt: number) {
		this.timeToNextSpawn -= dt * 1000;

		if (this.timeToNextSpawn <= 0) {
			this.spawnGoldenObject();
			this.timeToNextSpawn = this.getRandomSpawnTime();
		}
	}

	private getRandomSpawnTime(): number {
		return Math.random() * 60000 + 60000; // 60 to 60 seconds
	}

	private spawnGoldenObject() {
		console.log('Golden object spawned!');

		// random effect
		const effects = [ProductionBoostEffect, FlatBonusEffect];
		const EffectClass = effects[Math.floor(Math.random() * effects.length)];

		// collection logic
		const onCollect = (game: GameState) => {
			console.log('Applying random effect:', EffectClass.name);
			game.addEffect(new EffectClass());
		};

		// instantiate and add
		const golden = new GoldenObject(onCollect);
		this.state.addScreenObject(golden);
	}
}
