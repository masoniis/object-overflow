import { ResourceIds } from '$lib/game/core/state/constants';
import { GameState } from '$lib/game/core/state/game_state.svelte';
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
		gameState.modifyResource(ResourceIds.Currency, this.bonus);
	}
}
