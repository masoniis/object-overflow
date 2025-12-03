import type { Tickable } from '$lib/game/core/interfaces';

export class GameEngine {
	// The max value in which a frame delta can be to ensure that
	// nothing crazy happens.
	private static readonly MAX_DELTA_TIME = 1.0;

	// INFO: ------------------------
	//         instance state
	// ------------------------------
	private isRunning = false;
	private animationFrameId: number | null = null;
	private systems: Tickable[] = [];
	private lastTime: number = 0;

	constructor() {
		console.log('‼️ GameEngine instantiated');
	}

	// INFO: -----------------------------
	//         tickable management
	// -----------------------------------

	/**
	 * Add a tickable system to the loop.
	 */
	addSystem(system: Tickable): GameEngine {
		this.systems.push(system);
		return this;
	}

	/**
	 * Remove a specific system from the event loop.
	 */
	removeSystem(system: Tickable): GameEngine {
		this.systems = this.systems.filter((s) => s !== system);
		return this;
	}

	// INFO: -----------------------------
	//         public loop control
	// -----------------------------------

	start() {
		if (this.isRunning) {
			console.warn('⚠️ GameEngine ignored start request: This engine is already running.');
			return;
		}

		// if animation frame exists, the previous loop wasn't destroyed properly
		if (this.animationFrameId) return;

		this.isRunning = true;
		this.lastTime = performance.now();
		console.log('▶️ Game Engine Started');

		this.loop();
	}

	stop() {
		this.isRunning = false;

		if (this.animationFrameId) {
			cancelAnimationFrame(this.animationFrameId);
			this.animationFrameId = null;
			console.log('⏹️ Game Engine Stopped');
		}
	}

	// INFO: --------------------
	//         loop logic
	// --------------------------

	private loop() {
		if (!this.isRunning) return;

		// calculate delta time
		const currentTime = performance.now();
		let dt = (currentTime - this.lastTime) / 1000;

		if (dt > GameEngine.MAX_DELTA_TIME) {
			dt = GameEngine.MAX_DELTA_TIME;
		}

		this.lastTime = currentTime;

		// run tick and schedule the next frame
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
