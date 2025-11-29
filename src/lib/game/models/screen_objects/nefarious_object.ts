import type { GameState } from '$lib/game/core/game_state.svelte';
import { ScreenObject } from './screen_object';

export class NefariousObject extends ScreenObject {
	duration = 5000; // 5 seconds

	constructor(private onClickCallback: (game: GameState) => void) {
		super();
	}

	onClick(game: GameState): void {
		this.onClickCallback(game);
		game.removeScreenObject(this);
	}
}
