import { PlayerActionController } from '$lib/game/features/player/player_action_controller';
import { ProducerManager } from '$lib/game/features/production/producer_manager.svelte';
import { EffectManager } from '$lib/game/features/effects/effect_manager.svelte';
import { PlayerStatsManager } from '$lib/game/features/player/player_stats_manager.svelte';
import { UpgradeManager } from '$lib/game/features/upgrades/upgrade_manager.svelte';
import { ScreenObjectManager } from '$lib/game/features/screen_objects/screen_object_manager.svelte';
import { isResourceProvider, type ResourceProvider } from './resource_provider';
import { isSavable, type Savable } from '../../features/persistence/savable';
import { SaveManager } from '$lib/game/features/persistence/save_manager.svelte';

/**
 * Configuration object for game state with optional dependencies to inject.
 */
export interface GameStateDependencies {
	saves?: SaveManager;
	actions?: PlayerActionController;
	playerStats?: PlayerStatsManager;
	producers?: ProducerManager;
	upgrades?: UpgradeManager;
	effects?: EffectManager;
	screenObjects?: ScreenObjectManager;
}

type GameStateSystem = ResourceProvider | Savable | object;

/**
 * Game state acts as the core orchestrator of the application, wrapping all dependencies
 * to enable convenient access from the caller.
 */
export class GameState {
	// internal state
	private resourceProviders: ResourceProvider[] = [];

	// INFO: ---------------------
	//         sub-systems
	// ---------------------------

	// core infrastructure
	public readonly saves: SaveManager;

	// controllers
	public readonly actions: PlayerActionController;

	// domain data managers
	public readonly playerStats: PlayerStatsManager;
	public readonly producers: ProducerManager;
	public readonly upgrades: UpgradeManager;
	public readonly effects: EffectManager;
	public readonly screenObjects: ScreenObjectManager;

	// INFO: --------------
	//         setup
	// --------------------

	/**
	 * Creates a new GameState instance.
	 * @param deps Optional dependencies for injection.
	 */
	public constructor(deps: GameStateDependencies = {}) {
		this.saves = deps.saves ?? new SaveManager();

		this.playerStats = deps.playerStats ?? new PlayerStatsManager();
		this.producers = deps.producers ?? new ProducerManager();
		this.upgrades = deps.upgrades ?? new UpgradeManager();
		this.effects = deps.effects ?? new EffectManager();
		this.screenObjects = deps.screenObjects ?? new ScreenObjectManager();

		// initialized last just in case the state matters for construction (it shouldn't tho)
		this.actions = deps.actions ?? new PlayerActionController(this);

		this.register(this.saves);
		this.register(this.playerStats);
		this.register(this.producers);
		this.register(this.upgrades);
		this.register(this.effects);
		this.register(this.screenObjects);
		this.register(this.actions);
	}
	/**
	 * Inspects a manager and adds it to the correct internal lists
	 * based on what methods it implements.
	 */
	private register(system: GameStateSystem) {
		if (isResourceProvider(system)) {
			this.resourceProviders.push(system);
		}

		if (isSavable(system)) {
			if (!this.saves) {
				throw Error("Savable systems can't be registered before saves exist.");
			}
			this.saves.register(system);
		}
	}

	// INFO: ------------------------------
	//         facade orchestrators
	// ------------------------------------

	/**
	 * Modifies a target resource ID by a target amount.
	 */
	public modifyResource(id: string, amount: number) {
		if (!Number.isFinite(amount)) {
			console.warn(`[GameState] Invalid amount for resource modification: ${amount}`);
			return;
		}

		// find first provider that claims the resource id
		const provider = this.resourceProviders.find((p) => p.ownsResource(id));

		if (provider) {
			provider.modifyResource(id, amount);
		} else {
			console.warn(`[GameState] No provider found for resource: ${id}`);
		}
	}

	/**
	 * Gets the amount of a resource by its ID, returning 0 if the ID is unknown.
	 */
	public getResourceAmount(id: string): number {
		const provider = this.resourceProviders.find((p) => p.ownsResource(id));
		if (!provider) {
			console.warn(`[GameState] No provider found for resource: ${id}`);
			return 0;
		}
		return provider.getResourceAmount(id);
	}

	/**
	 * Tries to transact a resources, returning true if successful and false otherwise.
	 */
	public tryTransaction(costId: string, costAmount: number): boolean {
		const current = this.getResourceAmount(costId);
		if (current >= costAmount) {
			this.modifyResource(costId, -costAmount);
			return true;
		}
		return false;
	}

	// INFO: -------------------------
	//         derived getters
	// -------------------------------

	get totalObjectProduction(): number {
		const globalProductionMultiplier = this.effects.getGlobalProductionMultiplier();
		return this.producers.computeTotalProduction(globalProductionMultiplier);
	}
}
