import type { GameState } from '$lib/game/core/state/game_state.svelte';

export interface UpgradeRequirement {
	isMet(gameState: GameState): boolean;
}
