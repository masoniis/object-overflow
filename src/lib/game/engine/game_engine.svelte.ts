import type { Tickable } from './tickable/tickable_interface.ts';

export class GameEngine {
	// The max value in which a frame delta can be to ensure that
	// nothing crazy happens.
	private static readonly MAX_DELTA_TIME = 1.0;

	// NOTE: isRunning is used as opposed to a Singleton pattern
	// because we don't want to have a lifelong-instance eating
	// up browser resources. Full control over the engine life
	// is necessary for that, which means no Singleton.
	private static isRunning = false;

	// INFO: ------------------------
	//         instance state
	// ------------------------------
	private animationFrameId: number | null = null;
	private systems: Tickable[] = [];
	private lastTime: number = 0;

	constructor() {
		console.log('GameEngine instantiated');
	}

	// INFO: -----------------------------
	//         tickable management
	// -----------------------------------

	/**
	 * Add a tickable system to the loop.
	 */
	addSystem(system: Tickable) {
		this.systems.push(system);
	}

	/**
	 * Remove a specific system from the event loop.
	 */
	removeSystem(system: Tickable) {
		this.systems = this.systems.filter((s) => s !== system);
	}

	// INFO: -----------------------------
	//         public loop control
	// -----------------------------------

	start() {
		if (GameEngine.isRunning) {
			console.warn('⚠️ GameEngine ignored start request: An engine is already running.');
			return;
		}

		// if animation frame exists, the previous loop wasn't destroyed properly
		if (this.animationFrameId) return;

		GameEngine.isRunning = true;
		this.lastTime = performance.now();
		console.log('▶️ Game Engine Started');

		this.loop();
	}

	stop() {
		GameEngine.isRunning = false;

		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
			console.log('IU Game Engine Stopped');
		}
	}

	// INFO: --------------------
	//         loop logic
	// --------------------------

	private loop() {
		if (!GameEngine.isRunning) return;

		// calculate delta time
		const currentTime = performance.now();
		let dt = (currentTime - this.lastTime) / 1000;
		if (dt > this.MAX_DT) {
			dt = this.MAX_DT;
		}

		this.lastTime = currentTime;

		// run tick ands schedule the next frame
		this.tick(dt);
		this.animationFrameId = requestAnimationFrame(() => this.loop());
	}

	// Iterate all systems and tick them.
	private tick(dt: number) {
		for (const system of this.systems) {
			system.tick(dt);
		}
	}
}
