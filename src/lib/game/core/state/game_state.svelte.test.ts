// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameState, type GameStateDependencies } from './game_state.svelte';
import { ResourceIds } from './constants';

// mock all managers for testing
const mockSaveManager = {
	register: vi.fn()
};
const mockPlayerActionController = {};
const mockPlayerStatsManager = {
	objects: 0,
	addObjects: vi.fn((amount: number) => {
		mockPlayerStatsManager.objects += amount;
	})
};
const mockProducerA = { id: 'producer_a', count: 10 };
const mockProducerB = { id: 'producer_b', count: 5 };
const mockProducerManager = {
	getById: vi.fn((id: string) => {
		if (id === mockProducerA.id) return mockProducerA;
		if (id === mockProducerB.id) return mockProducerB;
		return undefined;
	}),
	computeTotalProduction: vi.fn().mockReturnValue(100)
};
const mockUpgradeManager = {};
const mockEffectManager = {
	getGlobalProductionMultiplier: vi.fn().mockReturnValue(1.0),
	add: vi.fn(),
	remove: vi.fn()
};
const mockScreenObjectManager = {};

// helper to easily create the mock deps
const createMockDeps = (): GameStateDependencies => ({
	saves: mockSaveManager as any,
	actions: mockPlayerActionController as any,
	playerStats: mockPlayerStatsManager as any,
	producers: mockProducerManager as any,
	upgrades: mockUpgradeManager as any,
	effects: mockEffectManager as any,
	screenObjects: mockScreenObjectManager as any
});

describe('GameState', () => {
	let gameState: GameState;
	let deps: GameStateDependencies;

	beforeEach(() => {
		// reset spies and mock state before each test
		vi.clearAllMocks();
		mockPlayerStatsManager.objects = 0;
		mockProducerA.count = 10;
		mockProducerB.count = 5;

		// reset mock implementations to ensure isolation
		mockEffectManager.getGlobalProductionMultiplier.mockReturnValue(1.0);
		mockProducerManager.computeTotalProduction.mockReturnValue(100);

		// create a new instance with mocks injected
		deps = createMockDeps();
		gameState = new GameState(deps);

		// suppress and spy on console.log/warn
		vi.spyOn(console, 'log').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		// restores original console logging
		vi.restoreAllMocks();
	});

	// INFO: -------------------------------------------------------
	//         initialization and dependency injection tests
	// -------------------------------------------------------------

	it('should initialize with injected dependencies', () => {
		// check if the state holds the injected objects
		expect(gameState.saves).toBe(deps.saves);
		expect(gameState.actions).toBe(deps.actions);
		expect(gameState.playerStats).toBe(deps.playerStats);
		expect(gameState.producers).toBe(deps.producers);
		expect(gameState.upgrades).toBe(deps.upgrades);
		expect(gameState.effects).toBe(deps.effects);
		expect(gameState.screenObjects).toBe(deps.screenObjects);
	});

	it('should initialize its sub-systems if no dependencies are provided', () => {
		const defaultState = new GameState();

		expect(defaultState.saves).toBeDefined();
		expect(defaultState.actions).toBeDefined();
		expect(defaultState.playerStats).toBeDefined();
		expect(defaultState.producers).toBeDefined();
		expect(defaultState.upgrades).toBeDefined();
		expect(defaultState.effects).toBeDefined();
		expect(defaultState.screenObjects).toBeDefined();
	});

	it('should initialize with NEW sub-systems when constructed', () => {
		const defaultState = new GameState();

		// check that a new instance is created, not one of the mocks
		expect(defaultState.saves).not.toBe(deps.saves);
		expect(defaultState.actions).not.toBe(deps.actions);
		expect(defaultState.playerStats).not.toBe(deps.playerStats);
		expect(defaultState.producers).not.toBe(deps.producers);
		expect(defaultState.upgrades).not.toBe(deps.upgrades);
		expect(defaultState.effects).not.toBe(deps.effects);
		expect(defaultState.screenObjects).not.toBe(deps.screenObjects);
	});

	it('should register all savable managers upon initialization', () => {
		// The registerSavables method is called in the constructor
		expect(mockSaveManager.register).toHaveBeenCalledTimes(4);
		expect(mockSaveManager.register).toHaveBeenCalledWith(mockPlayerStatsManager);
		expect(mockSaveManager.register).toHaveBeenCalledWith(mockProducerManager);
		expect(mockSaveManager.register).toHaveBeenCalledWith(mockUpgradeManager);
		expect(mockSaveManager.register).toHaveBeenCalledWith(mockEffectManager);
	});

	// INFO: ---------------------------------
	//         resource modifier tests
	// ---------------------------------------

	describe('Resource Management', () => {
		it('should correctly modify the currency resource (ResourceIds.Currency)', () => {
			const initialObjects = mockPlayerStatsManager.objects;

			// add currency
			gameState.modifyResource(ResourceIds.Currency, 50);
			expect(mockPlayerStatsManager.addObjects).toHaveBeenCalledWith(50);
			expect(mockPlayerStatsManager.objects).toBe(initialObjects + 50);

			// subtract currency
			gameState.modifyResource(ResourceIds.Currency, -10);
			expect(mockPlayerStatsManager.addObjects).toHaveBeenCalledWith(-10);
			expect(mockPlayerStatsManager.objects).toBe(initialObjects + 40);
		});

		it('should correctly modify a producer resource', () => {
			const initialCount = mockProducerA.count;

			// add to producer
			gameState.modifyResource('producer_a', 2);
			expect(mockProducerA.count).toBe(initialCount + 2);

			// subtract from producer
			gameState.modifyResource('producer_a', -5);
			expect(mockProducerA.count).toBe(initialCount + 2 - 5);
		});

		it('should warn and do nothing for non-finite amounts in modifyResource', () => {
			gameState.modifyResource(ResourceIds.Currency, Infinity);
			expect(console.warn).toHaveBeenCalled();
			expect(mockPlayerStatsManager.addObjects).not.toHaveBeenCalled();

			gameState.modifyResource(ResourceIds.Currency, NaN);
			expect(console.warn).toHaveBeenCalledTimes(2);
			expect(mockPlayerStatsManager.addObjects).not.toHaveBeenCalled();
		});

		it('should warn and do nothing for unknown resource IDs in modifyResource', () => {
			gameState.modifyResource('unknown_id', 10);
			expect(console.warn).toHaveBeenCalled();
			expect(mockPlayerStatsManager.addObjects).not.toHaveBeenCalled();
		});

		it('should correctly get the amount of the currency resource', () => {
			mockPlayerStatsManager.objects = 1234;
			expect(gameState.getResourceAmount(ResourceIds.Currency)).toBe(1234);
		});

		it('should correctly get the amount of a producer resource', () => {
			expect(gameState.getResourceAmount('producer_a')).toBe(10);
			expect(gameState.getResourceAmount('producer_b')).toBe(5);
		});

		it('should warn and return 0 for an unknown resource ID in getResourceAmount', () => {
			const amount = gameState.getResourceAmount('unknown_resource_id');
			expect(console.warn).toHaveBeenCalled();
			expect(amount).toBe(0);
		});
	});

	// INFO: ------------------------------
	//         testing transactions
	// ------------------------------------

	describe('Transactions', () => {
		beforeEach(() => {
			// ensure currency is available for tests
			mockPlayerStatsManager.objects = 100;
		});

		it('should return true and deduct cost if resource is sufficient', () => {
			const cost = 30;
			const success = gameState.tryTransaction(ResourceIds.Currency, cost);

			expect(success).toBe(true);
			// check that the resource was actually deducted
			expect(mockPlayerStatsManager.objects).toBe(100 - cost);
			expect(mockPlayerStatsManager.addObjects).toHaveBeenCalledWith(-cost);
		});

		it('should return false and not deduct cost if resource is insufficient', () => {
			const cost = 150;
			const success = gameState.tryTransaction(ResourceIds.Currency, cost);

			expect(success).toBe(false);
			// check that the resource count remains unchanged
			expect(mockPlayerStatsManager.objects).toBe(100);
			expect(mockPlayerStatsManager.addObjects).not.toHaveBeenCalled();
		});

		it('should handle transactions for producer resources', () => {
			// initial count for producer_a is 10
			const cost = 7;
			const success = gameState.tryTransaction('producer_a', cost);

			expect(success).toBe(true);
			expect(mockProducerA.count).toBe(10 - cost);

			// try another transaction that fails
			const failedSuccess = gameState.tryTransaction('producer_a', 5); // remaining is 3, cost is 5

			expect(failedSuccess).toBe(false);
			expect(mockProducerA.count).toBe(3); // should not have changed
		});
	});

	// INFO: ------------------------------------------------
	//         testing derived getters and delegators
	// ------------------------------------------------------

	describe('Derived Getters', () => {
		it('should calculate totalObjectProduction using ProducerManager and EffectManager', () => {
			// mock setup: multiplier=2.0, total production=50
			mockEffectManager.getGlobalProductionMultiplier.mockReturnValue(2.0);
			mockProducerManager.computeTotalProduction.mockReturnValue(50);

			const total = gameState.totalObjectProduction;

			// check if the managers were called correctly
			expect(mockEffectManager.getGlobalProductionMultiplier).toHaveBeenCalled();
			expect(mockProducerManager.computeTotalProduction).toHaveBeenCalledWith(2.0);

			// the value returned by computeTotalProduction is the final result
			expect(total).toBe(50);
		});
	});

	describe('Effect Delegation', () => {
		const mockEffect = { name: 'TestEffect' };

		it('should delegate addEffect to the EffectManager', () => {
			gameState.addEffect(mockEffect);
			expect(mockEffectManager.add).toHaveBeenCalledWith(mockEffect, gameState);
		});

		it('should delegate removeEffect to the EffectManager', () => {
			gameState.removeEffect(mockEffect);
			expect(mockEffectManager.remove).toHaveBeenCalledWith(mockEffect, gameState);
		});
	});
});
