import { ScreenObjectConfig } from '../screen_object_data';
import { InteractiveObject } from './interactive_object';

export class GoldenObject extends InteractiveObject {
	duration = ScreenObjectConfig.GoldenObject.spawnDuration;
}
