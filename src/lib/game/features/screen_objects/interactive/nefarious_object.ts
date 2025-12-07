import type { GameState } from '$lib/game/core/state/game_state.svelte';
import { ScreenObjectConfig } from '../screen_object_data';
import { FloatingText } from '../visual/floating_text';
import { InteractiveObject } from './interactive_object';

export class NefariousObject extends InteractiveObject {
	private static TAUNT_STRING = 'u are bad';

	duration = ScreenObjectConfig.NafariousObject.spawnDuration;

	onExpire(game: GameState): void {
		let text = new FloatingText(NefariousObject.TAUNT_STRING, this.x_pos, this.y_pos);
		game.screenObjects.add(text);
	}
}
