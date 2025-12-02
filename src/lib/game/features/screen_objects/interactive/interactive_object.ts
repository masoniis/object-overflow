import { ScreenObject } from '../screen_object';
import type { GameState } from '$lib/game/core/state/game_state.svelte';

// A type of screen object that can be interacted with by the user
// to trigger certain effects, after which it disappears.
export abstract class InteractiveObject extends ScreenObject {
	protected hasInteracted = false;

	constructor(protected onInteractCallback: (game: GameState) => void) {
		// interactive objects are positioned randomly on the screen (from 0 to 100)
		super(Math.random() * 100, Math.random() * 100);
	}

	interact(game: GameState): void {
		if (this.hasInteracted || this.isExpired) return;

		this.hasInteracted = true;
		this.onInteractCallback(game);
		game.screenObjects.remove(this);
	}
}
