import type { GameState } from '$lib/game/core/game_state.svelte';
import { FloatingText } from '../floating_text/floating_text';
import { InteractiveObject } from './interactive_object';

export class NefariousObject extends InteractiveObject {
	duration = 5000;

	onExpire(game: GameState): void {
		let text = new FloatingText('why no click :(', this.x_pos, this.y_pos);
		game.addScreenObject(text);
	}
}
