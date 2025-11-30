import type { GameState } from '$lib/game/core/game_state.svelte';

// A class representing objects that appear on the screen, and can be interacted
// with by the user to trigger other logic before disappearing.
export abstract class ScreenObject {
	id = crypto.randomUUID();
	x: number;
	y: number;
	spawnedAt: number = Date.now();

	// guard against double-clicks
	protected hasInteracted = false;

	// the duration the object remains on screen before expiring
	abstract duration: number;

	constructor(protected onInteractCallback: (game: GameState) => void) {
		this.x = Math.random() * 100;
		this.y = Math.random() * 100;
	}

	/**
	 * An interaction intended to be called by the UI.
	 */
	interact(game: GameState): void {
		if (this.hasInteracted || this.isExpired) return;
		this.hasInteracted = true;

		// run behavior and remove the object after interaction
		this.onInteractCallback(game);
		game.removeScreenObject(this);
	}

	/**
	 * What happens if the object disappears without being clicked?
	 */
	onExpire(_game: GameState): void {
		// defaults to nothing
	}

	get isExpired(): boolean {
		return Date.now() - this.spawnedAt >= this.duration;
	}
}
