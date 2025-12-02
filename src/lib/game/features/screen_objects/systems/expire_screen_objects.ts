import { ThrottledSystem } from '../../../core/engine/system/throttled_system';
import type { GameState } from '$lib/game/core/state/game_state.svelte';

export class ScreenObjectLifecycleSystem extends ThrottledSystem {
	constructor(state: GameState) {
		// Run 8 times per second (approx every 125ms)
		super(state, 8);
	}

	protected runThrottled() {
		const objects = this.state.screenObjects;

		// iterate backwards for safe removal
		for (let i = objects.list.length - 1; i >= 0; i--) {
			const obj = objects.list[i];

			if (obj.isExpired) {
				obj.onExpire(this.state);
				this.state.screenObjects.remove(obj);
			}
		}
	}
}
