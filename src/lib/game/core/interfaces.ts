export interface Tickable {
	/**
	 * Updates the system based on the time passed in the main game engine.
	 * @param delta_seconds - Delta time in seconds (e.g., 0.016 for 60fps)
	 */
	tick(delta_seconds: number): void;
}

export interface Savable<T> {
	save(): T;
	load(data: T): void;
}
