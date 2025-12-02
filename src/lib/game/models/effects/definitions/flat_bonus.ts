import { GameState } from '$lib/game/core/game_state.svelte';
import { Effect } from '../effect.svelte';

export class FlatBonusEffect extends Effect {
	id = 'flat-bonus';
	name = 'Flat Bonus';
	description = 'Instantly grants 100 objects.';
	duration = 0; // instant effect

	onApply(gameState: GameState): void {
		gameState.addObjects(100);
	}
}
