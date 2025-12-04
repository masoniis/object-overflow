import type { UpgradeRequirement } from './upgrade_requirement';
import type { GameState } from '$lib/game/core/state/game_state.svelte';

export class OtherUpgradeFirstRequirement implements UpgradeRequirement {
	constructor(private readonly otherUpgradeRequired: string) {}

	isMet(gameState: GameState): boolean {
		// we are only met if the other upgrade has been purchased
		const otherUpgrade = gameState.upgrades.getById(this.otherUpgradeRequired);
		return otherUpgrade ? otherUpgrade.isPurchased : false;
	}
}
