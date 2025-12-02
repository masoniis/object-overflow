import { GameSystem } from '../abstract_gamesystem.ts';

export class ProcessEffectsSystem extends GameSystem {
	tick(dt: number) {
		for (const effect of this.state.effects) {
			effect.tick(this.state, dt);

			if (effect.isExpired) {
				this.state.removeEffect(effect);
			}
		}
	}
}
