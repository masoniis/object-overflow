import { System } from '../../core/engine/system/system.ts';

export class ProcessEffectsSystem extends System {
	tick(_delta_seconds: number) {
		for (const effect of this.state.effects) {
			if (effect.isExpired) {
				this.state.removeEffect(effect);
			}
		}
	}
}
