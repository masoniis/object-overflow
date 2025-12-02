import { GameSystem } from '../abstract_gamesystem';

export class ScreenObjectLifecycleSystem extends GameSystem {
	tick(_dt: number) {
		const objects = this.state.screenObjects;

		// iterate backwards for safe removal
		for (let i = objects.length - 1; i >= 0; i--) {
			const obj = objects[i];

			if (obj.isExpired) {
				obj.onExpire(this.state);
				this.state.removeScreenObject(obj);
			}
		}
	}
}
