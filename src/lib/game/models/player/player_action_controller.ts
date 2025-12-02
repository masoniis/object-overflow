import type { GameState } from '$lib/game/core/state/game_state.svelte';
import { FloatingText } from '../screen_objects/visual/floating_text';
import { ResourceIds } from '../../core/state/constants';

export class PlayerActionController {
	constructor(private state: GameState) {}

	/**
	 * Handles the specific logic of that occurs when clicking the main +object button.
	 */
	public clickMainObjective(x: number, y: number) {
		const amount = this.state.playerStats.manualClickPower;

		this.state.modifyResource(ResourceIds.Currency, amount);

		const text = new FloatingText(`+${amount}`, x, y);
		this.state.screenObjects.add(text);
	}
}
