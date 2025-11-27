import { GameState } from '$lib/game/core/game_state.svelte';
import { Effect } from '../effect.svelte';

export class FlatBonusEffect extends Effect {
	constructor(
		id: string,
		name: string,
		description: string,
		public bonus: number,
		duration: number | null
	) {
		super(id, name, description, duration);
	}

	onApply(gameState: GameState): void {
		gameState.addObjects(this.bonus);
	}
}
