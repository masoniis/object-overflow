import type { GameState } from '$lib/game/core/game_state.svelte';
import { FloatingText } from '../models/screen_objects/floating_text/floating_text';

export class PlayerActionManager {
	constructor(private state: GameState) {}

	/**
	 * Handles the specific logic of that occurs when clicking the main +object button.
	 */
	public clickMainObjective(x: number, y: number) {
		const amount = this.state.manualClickPower;

		this.state.modifyResource('object', amount);

		const text = new FloatingText(`+${amount}`, x, y);
		this.state.addScreenObject(text);
	}
}
