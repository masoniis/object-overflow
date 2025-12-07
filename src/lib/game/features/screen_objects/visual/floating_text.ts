import { ScreenObject } from '../screen_object';
import { ScreenObjectConfig } from '../screen_object_data';

export class FloatingText extends ScreenObject {
	duration = ScreenObjectConfig.FloatingText.spawnDuration;

	constructor(
		public text: string,
		x: number,
		y: number
	) {
		super(x, y);
	}
}
