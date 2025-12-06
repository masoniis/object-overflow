import { GameState } from '$lib/game/core/state/game_state.svelte';
import { EffectFactory } from '../../effects/effect_factory';
import { Upgrade, type UpgradeConfig } from '../upgrade.svelte';

export interface GlobalMultiplierConfig extends UpgradeConfig {
	multiplier: number;
}

export class GlobalProductionMultiplierUpgrade extends Upgrade {
	multiplier: number;

	constructor(config: GlobalMultiplierConfig) {
		super(config);
		this.multiplier = config.multiplier;
	}

	applyEffect(gameState: GameState): void {
		gameState.effects.add(
			EffectFactory.createPersistentMultiplierEffect(
				'prod-mult-from-' + this.id,
				this.name,
				this.description,
				this.multiplier
			)
		);
	}

	requirement(_gameState: GameState): boolean {
		// always available if not purchased
		return !this.isPurchased;
	}
}
