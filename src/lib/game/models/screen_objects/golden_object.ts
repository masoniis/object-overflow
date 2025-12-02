import type { GameState } from '$lib/game/core/game_state.svelte';
import { ScreenObject } from './screen_object';

export class GoldenObject extends ScreenObject {
	duration = 7000; // 7 seconds
	icon = '🌟';
	cssClass = 'golden';

	constructor(private onClickCallback: (game: GameState) => void) {
		super();
	}

	onClick(game: GameState): void {
		this.onClickCallback(game);
		game.removeScreenObject(this);
	}
}
