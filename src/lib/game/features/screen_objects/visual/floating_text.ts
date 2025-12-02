import { ScreenObject } from '../screen_object';

export class FloatingText extends ScreenObject {
	duration = 1500;

	constructor(
		public text: string,
		x: number,
		y: number
	) {
		super(x, y);
	}
}
