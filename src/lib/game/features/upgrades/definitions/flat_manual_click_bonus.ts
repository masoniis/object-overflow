import type { GameState } from '$lib/game/core/state/game_state.svelte';
import { Upgrade, type UpgradeConfig } from '../upgrade.svelte';

export interface FlatClickBonusConfig extends UpgradeConfig {
	bonus: number;
}

export class FlatManualClickBonusUpgrade extends Upgrade {
	bonus: number;

	constructor(config: FlatClickBonusConfig) {
		super(config);
		this.bonus = config.bonus;
	}

	applyEffect(gameState: GameState): void {
		gameState.playerStats.addClickPower(this.bonus);
	}

	requirement(_gameState: GameState): boolean {
		// always available if not purchased
		return !this.isPurchased;
	}
}
