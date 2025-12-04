import type { GameState } from '$lib/game/core/game_state.svelte';
import { Upgrade } from '../upgrade.svelte';

export class FlatManualClickBonusUpgrade extends Upgrade {
	bonus: number;

	constructor(id: string, name: string, description: string, cost: number, bonus: number) {
		super(id, name, description, cost);
		this.bonus = bonus;
	}

	onPurchase(gameState: GameState): void {
		gameState.manualClickPower += this.bonus;
	}

	onLoad(gameState: GameState): void {
		gameState.manualClickPower += this.bonus;
	}

	requirement(_gameState: GameState): boolean {
		// always available if not purchased
		return !this.isPurchased;
	}
}
