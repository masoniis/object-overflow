import type { UpgradeRequirement } from './upgrade_requirement';
import type { GameState } from '$lib/game/core/state/game_state.svelte';

export class PreviousUpgradeRequirement implements UpgradeRequirement {
	constructor(private readonly upgradeId: string) {}

	isMet(gameState: GameState): boolean {
		const upgrade = gameState.upgrades.getById(this.upgradeId);
		return upgrade ? upgrade.isPurchased : false;
	}
}
