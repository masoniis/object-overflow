// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';
import { GameEngine } from './game_engine.svelte';
import type { Tickable } from '$lib/game/core/engine/tickable';

interface MockTickable extends Tickable {
	tick: Mock<(dt: number) => void>;
}

describe('GameEngine', () => {
	let engine: GameEngine;
	let currentTime = 0;

	beforeEach(() => {
		currentTime = 0;

		// Takes control of time (setTimeout, requestAnimationFrame, performance.now)
		vi.useFakeTimers();
		engine = new GameEngine();
	});

	afterEach(() => {
		engine.stop();
		// Returns back regular control of time
		vi.useRealTimers();
	});

	it('should start and stop the loop correctly', () => {
		// Create a simple "spy" object
		const mockSystem: MockTickable = { tick: vi.fn() };

		engine.addSystem(mockSystem);
		engine.start();

		// Simulate 1s passing
		vi.advanceTimersByTime(1000);

		// At 60fps, 1s is ~60 ticks
		expect(mockSystem.tick).toHaveBeenCalled();
		const callCount = mockSystem.tick.mock.calls.length;
		// At least 15 ticks should have passed, usually closer
		// to 60 though depending on device in our tests
		expect(callCount).toBeGreaterThan(15);

		// STOP the engine
		engine.stop();

		// Advance time again
		vi.advanceTimersByTime(1000);

		// Ensure no NEW calls happened
		expect(mockSystem.tick).toHaveBeenCalledTimes(callCount);
	});

	it('should allow adding and removing systems dynamically', () => {
		const systemA = { tick: vi.fn() };
		const systemB = { tick: vi.fn() };

		// Add systemA and ensure it gets called
		engine.addSystem(systemA);
		engine.start();

		vi.advanceTimersByTime(16);
		expect(systemA.tick).toHaveBeenCalled();
		expect(systemB.tick).not.toHaveBeenCalled();

		// Now add systemB and ensure it also gets called
		engine.addSystem(systemB);
		vi.advanceTimersByTime(16);
		expect(systemB.tick).toHaveBeenCalled();

		// Remove systemA and clear history to check strictly new calls
		engine.removeSystem(systemA);
		vi.clearAllMocks();

		// SystemB should be called, but not system A now
		vi.advanceTimersByTime(16);
		expect(systemA.tick).not.toHaveBeenCalled();
		expect(systemB.tick).toHaveBeenCalled();
	});
});
