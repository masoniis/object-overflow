import { ThrottledSystem } from '../../../core/engine/system/throttled_system';
import type { GameState } from '$lib/game/core/state/game_state.svelte';

export class ScreenObjectLifecycleSystem extends ThrottledSystem {
	// run 8 times per second
	private static EXPIRE_CHECKS_PER_SECOND = 8;

	constructor(state: GameState) {
		super(state, ScreenObjectLifecycleSystem.EXPIRE_CHECKS_PER_SECOND);
	}

	protected runThrottled() {
		this.state.screenObjects.prune(
			(obj) => obj.isExpired,
			(obj) => obj.onExpire(this.state)
		);
	}
}
