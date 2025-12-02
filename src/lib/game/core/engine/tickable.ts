export interface Tickable {
	/**
	 * Updates the system based on the time passed in the main game engine.
	 * @param delta_seconds - Delta time in seconds since last tick
	 */
	tick(delta_seconds: number): void;
}
