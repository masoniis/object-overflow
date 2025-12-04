import { ThrottledSystem } from '../../../core/engine/system/throttled_system';
import type { GameState } from '$lib/game/core/state/game_state.svelte';

export class ScreenObjectLifecycleSystem extends ThrottledSystem {
	constructor(state: GameState) {
		// Run 8 times per second (approx every 125ms)
		super(state, 8);
	}

	protected runThrottled() {
		this.state.screenObjects.prune(
			(obj) => obj.isExpired,
			(obj) => obj.onExpire(this.state)
		);
	}
}
