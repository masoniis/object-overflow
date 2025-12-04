import type { UpgradeRequirement } from './upgrade_requirement';
import type { GameState } from '$lib/game/core/state/game_state.svelte';

export class LifetimeEarningsUpgradeRequirement implements UpgradeRequirement {
	constructor(private readonly requiredLifetimeEarnings: number) {}

	isMet(gameState: GameState): boolean {
		return gameState.playerStats.lifetimeObjects >= this.requiredLifetimeEarnings;
	}
}
