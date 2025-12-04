import { ResourceIds } from './constants';
import { PlayerActionController } from '$lib/game/features/player/player_action_controller';
import { SaveManager } from '../save/save_manager.svelte';
import { ProducerManager } from '$lib/game/features/production/producer_manager.svelte';
import { EffectManager } from '$lib/game/features/effects/effect_manager.svelte';
import { PlayerStatsManager } from '$lib/game/features/player/player_stats_manager.svelte';
import { UpgradeManager } from '$lib/game/features/upgrades/upgrade_manager.svelte';
import { ScreenObjectManager } from '$lib/game/features/screen_objects/screen_object_manager.svelte';

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

/**
 * Game state acts as the core orchestrator of the application, wrapping all dependencies
 * to enable convenient access from the caller.
 */
export class GameState {
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
		console.log('Initializing GameState with dependencies...');

		this.saves = deps.saves ?? new SaveManager();

		this.playerStats = deps.playerStats ?? new PlayerStatsManager();
		this.producers = deps.producers ?? new ProducerManager();
		this.upgrades = deps.upgrades ?? new UpgradeManager();
		this.effects = deps.effects ?? new EffectManager();
		this.screenObjects = deps.screenObjects ?? new ScreenObjectManager();

		// initialized last just in case the state matters for construction (it shouldn't tho)
		this.actions = deps.actions ?? new PlayerActionController(this);

		// register all savables to the state
		this.registerSavables();

		console.log('GameState initialized!');
	}

	private registerSavables() {
		this.saves.register(this.playerStats);
		this.saves.register(this.producers);
		this.saves.register(this.upgrades);
		this.saves.register(this.effects);
	}

	// INFO: ------------------------------
	//         facade orchestrators
	// ------------------------------------

	/**
	 * Modifies a target resource ID by a target amount.
	 */
	public modifyResource(id: string, amount: number) {
		if (!Number.isFinite(amount)) {
			console.warn(`[GameState] Invalid amount for ${id}:`, amount);
			return;
		}

		// acts as a router here, deciding which inner class to update

		if (id === ResourceIds.Currency) {
			this.playerStats.addMainCurrency(amount);
			return;
		}

		const producer = this.producers.getById(id);
		if (producer) {
			producer.count += amount;
			return;
		}

		console.warn(`[GameState] Unknown resource ID: ${id}`);
	}

	/**
	 * Gets the amount of a resource by its ID, returning 0 if the ID is unknown.
	 */
	public getResourceAmount(id: string): number {
		if (id === ResourceIds.Currency) return this.playerStats.objects;
		const producer = this.producers.getById(id);
		if (producer) {
			return producer.count;
		}
		console.warn(`[GameState] Attempted to get amount for unknown resource ID: '${id}'`);
		return 0;
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

	// delegation for effects
	addEffect(effect: any) {
		this.effects.add(effect, this);
	}
	removeEffect(effect: any) {
		this.effects.remove(effect, this);
	}
}
