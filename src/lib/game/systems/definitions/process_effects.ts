import { GameSystem } from '../abstract_gamesystem.ts';

export class ProcessEffectsSystem extends GameSystem {
	tick(_dt: number) {
		for (const effect of this.state.effects) {
			if (effect.isExpired) {
				this.state.removeEffect(effect);
			}
		}
	}
}
