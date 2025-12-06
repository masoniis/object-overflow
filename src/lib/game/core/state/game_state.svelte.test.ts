// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameState, type GameStateDependencies } from './game_state.svelte';
import { PlayerResource } from '../../features/player/player_resource';

// INFO: ----------------------------------
//         mock factories & helpers
// ----------------------------------------

/**
 * A smart mock factory for the ProducerManager.
 */
const createMockProducerManager = (initialProducers: { id: string; count: number }[]) => {
	const data = new Map(initialProducers.map((p) => [p.id, p.count]));

	return {
		// resource provider Implementation
		ownsResource: (id: string) => data.has(id),
		getResourceAmount: (id: string) => data.get(id) ?? 0,
		modifyResource: vi.fn((id: string, amount: number) => {
			if (data.has(id)) {
				const current = data.get(id) ?? 0;
				data.set(id, current + amount);
			}
		}),

		// savable Implementation
		saveKey: 'producers',
		save: vi.fn(),
		load: vi.fn(),

		// other mocks
		getById: vi.fn((id: string) => (data.has(id) ? { id, count: data.get(id)! } : undefined)),
		computeTotalProduction: vi.fn().mockReturnValue(100)
	};
};

// simple mocks for other dependencies
const mockSaveManager = { register: vi.fn() };
const mockPlayerActionController = {};
const mockUpgradeManager = { saveKey: 'upgrades', save: vi.fn(), load: vi.fn() };
const mockScreenObjectManager = {};

const mockEffectManager = {
	getGlobalProductionMultiplier: vi.fn().mockReturnValue(1.0),
	add: vi.fn(),
	remove: vi.fn(),
	saveKey: 'effects',
	save: vi.fn(),
	load: vi.fn()
};

const mockPlayerStatsManager = {
	objects: 0,
	addMainCurrency: vi.fn((amount: number) => {
		mockPlayerStatsManager.objects += amount;
	}),
	ownsResource: (id: string) => id === PlayerResource.Currency,
	getResourceAmount: (_id: string) => mockPlayerStatsManager.objects,
	modifyResource: (_id: string, amount: number) => mockPlayerStatsManager.addMainCurrency(amount),
	saveKey: 'player_stats',
	save: vi.fn(),
	load: vi.fn()
};

// INFO: -----------------
//         testing
// -----------------------

describe('GameState', () => {
	let gameState: GameState;
	let deps: GameStateDependencies;

	let mockProducerManager: ReturnType<typeof createMockProducerManager>;

	beforeEach(() => {
		vi.clearAllMocks();

		// reset simple mocks
		mockPlayerStatsManager.objects = 0;
		mockEffectManager.getGlobalProductionMultiplier.mockReturnValue(1.0);

		// create fresh producer mock
		mockProducerManager = createMockProducerManager([
			{ id: 'producer_a', count: 10 },
			{ id: 'producer_b', count: 5 }
		]);

		deps = {
			saves: mockSaveManager as any,
			actions: mockPlayerActionController as any,
			playerStats: mockPlayerStatsManager as any,
			producers: mockProducerManager as any,
			upgrades: mockUpgradeManager as any,
			effects: mockEffectManager as any,
			screenObjects: mockScreenObjectManager as any
		};

		// initialize game state
		gameState = new GameState(deps);

		// suppress and spy on console spam
		vi.spyOn(console, 'log').mockImplementation(() => {});
		vi.spyOn(console, 'warn').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	// INFO: -------------------------------
	//         testing initialization
	// -------------------------------------

	it('should initialize with injected dependencies', () => {
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

	it('should initialize with NEW sub-systems when constructed default', () => {
		const defaultState = new GameState();
		expect(defaultState.saves).not.toBe(deps.saves);
		// ensure it didn't use our mocks
		expect(defaultState.producers).not.toBe(deps.producers);
	});

	it('should register all savable managers upon initialization', () => {
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

			gameState.modifyResource(PlayerResource.Currency, 50);
			expect(mockPlayerStatsManager.addMainCurrency).toHaveBeenCalledWith(50);
			expect(mockPlayerStatsManager.objects).toBe(initialObjects + 50);

			gameState.modifyResource(PlayerResource.Currency, -10);
			expect(mockPlayerStatsManager.addMainCurrency).toHaveBeenCalledWith(-10);
			expect(mockPlayerStatsManager.objects).toBe(initialObjects + 40);
		});

		it('should correctly modify a producer resource using the smart mock', () => {
			// initial state from beforeEach: producer_a = 10

			// add 2 and verify calls
			gameState.modifyResource('producer_a', 2);
			expect(mockProducerManager.modifyResource).toHaveBeenCalledWith('producer_a', 2);
			expect(mockProducerManager.getResourceAmount('producer_a')).toBe(12);

			// subtract and do same
			gameState.modifyResource('producer_a', -5);
			expect(mockProducerManager.getResourceAmount('producer_a')).toBe(7);
		});

		it('should warn and do nothing for non-finite amounts in modifyResource', () => {
			gameState.modifyResource(PlayerResource.Currency, Infinity);
			expect(console.warn).toHaveBeenCalled();
			expect(mockPlayerStatsManager.addMainCurrency).not.toHaveBeenCalled();

			gameState.modifyResource(PlayerResource.Currency, NaN);
			expect(console.warn).toHaveBeenCalledTimes(2);
		});

		it('should warn and do nothing for unknown resource IDs', () => {
			gameState.modifyResource('unknown_id', 10);
			expect(console.warn).toHaveBeenCalled();
			expect(mockPlayerStatsManager.addMainCurrency).not.toHaveBeenCalled();
			expect(mockProducerManager.modifyResource).not.toHaveBeenCalled();
		});

		it('should correctly get the amount of the currency resource', () => {
			mockPlayerStatsManager.objects = 1234;
			expect(gameState.getResourceAmount(PlayerResource.Currency)).toBe(1234);
		});

		it('should correctly get the amount of a producer resource', () => {
			expect(gameState.getResourceAmount('producer_a')).toBe(10);
			expect(gameState.getResourceAmount('producer_b')).toBe(5);
		});

		it('should warn and return 0 for an unknown resource ID', () => {
			const amount = gameState.getResourceAmount('unknown_resource_id');
			expect(console.warn).toHaveBeenCalled();
			expect(amount).toBe(0);
		});
	});

	// INFO: ---------------------------
	//         transaction tests
	// ---------------------------------

	describe('Transactions', () => {
		beforeEach(() => {
			mockPlayerStatsManager.objects = 100;
		});

		it('should return true and deduct cost if resource is sufficient', () => {
			const cost = 30;
			const success = gameState.tryTransaction(PlayerResource.Currency, cost);

			expect(success).toBe(true);
			expect(mockPlayerStatsManager.objects).toBe(70);
			expect(mockPlayerStatsManager.addMainCurrency).toHaveBeenCalledWith(-cost);
		});

		it('should return false and not deduct cost if resource is insufficient', () => {
			const cost = 150;
			const success = gameState.tryTransaction(PlayerResource.Currency, cost);

			expect(success).toBe(false);
			expect(mockPlayerStatsManager.objects).toBe(100);
			expect(mockPlayerStatsManager.addMainCurrency).not.toHaveBeenCalled();
		});

		it('should handle transactions for producer resources via smart mock', () => {
			// initial count for producer_a is 10
			const cost = 7;
			const success = gameState.tryTransaction('producer_a', cost);

			// check success and that transaction went through
			expect(success).toBe(true);
			expect(mockProducerManager.getResourceAmount('producer_a')).toBe(3);

			// check fail and that transaction didn't go through
			const failedSuccess = gameState.tryTransaction('producer_a', 5); // have 3, cost 5
			expect(failedSuccess).toBe(false);
			expect(mockProducerManager.getResourceAmount('producer_a')).toBe(3); // unchanged
		});
	});

	// INFO: ------------------------------
	//         tests for delegators
	// ------------------------------------

	describe('Derived Getters', () => {
		it('should calculate totalObjectProduction', () => {
			mockEffectManager.getGlobalProductionMultiplier.mockReturnValue(2.0);
			mockProducerManager.computeTotalProduction.mockReturnValue(50);

			const total = gameState.totalObjectProduction;

			expect(mockEffectManager.getGlobalProductionMultiplier).toHaveBeenCalled();
			expect(mockProducerManager.computeTotalProduction).toHaveBeenCalledWith(2.0);
			expect(total).toBe(50);
		});
	});
});
