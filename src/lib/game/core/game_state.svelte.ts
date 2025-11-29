import { Producer, type ProducerSaveData } from '$lib/game/models/producers/producer.svelte';
import type { Effect } from '$lib/game/models/effects/effect.svelte';
import { ProductionMultiplierEffect } from '$lib/game/models/effects/definitions/production_multiplier';
import type { ScreenObject } from '$lib/game/models/screen_objects/screen_object';
import { INITIAL_PRODUCERS } from '../data/initial_producers';
import type { Upgrade, UpgradeSaveData } from '$lib/game/models/upgrades/upgrade.svelte';
import { INITIAL_UPGRADES } from '../data/initial_upgrades';

/// The shape of the global save file
interface GlobalSaveData {
	objects: number;
	producers: { id: string; data: ProducerSaveData }[];
	upgrades: { id: string; data: UpgradeSaveData }[];
}

/// The core state singleton that represents the game (currency, income, etc)
export class GameState {
	private static readonly SAVE_KEY = 'object-overflow-save';

	// default state for game elements
	private static readonly DEFAULT_MANUAL_CLICK_POWER = 1;

	// INFO: ------------------------
	//        singleton setup
	// ------------------------------

	private static instance: GameState;

	private constructor() {
		console.log('GameState initialized!');
	}

	/// Get a reference to the global `GameState` instance.
	public static getInstance(): GameState {
		if (!GameState.instance) {
			GameState.instance = new GameState();
		}
		return GameState.instance;
	}

	// INFO: ------------------------------
	//         resources management
	// ------------------------------------

	private _objects = $state(0);
	get objects() {
		return this._objects;
	}

	manualClickPower = $state(1);

	/**
	 *  Modify a target resource `id` by number `amount`
	 */
	public modifyResource(id: string, amount: number) {
		if (!Number.isFinite(amount)) {
			console.warn(`[GameState] Attempted to modify '${id}' by invalid amount:`, amount);
			return;
		}

		if (id === 'object') {
			this._objects += amount;
			return;
		}

		// check if the ID belongs to a producer
		const producer = this._producers.find((p) => p.id === id);
		if (producer) {
			producer.count += amount;
			return;
		}

		console.warn(`Attempted to modify unknown resource: ${id}`);
	}

	/**
	 *  Gets the current amount of any resource
	 */
	public getResourceAmount(id: string): number {
		if (id === 'object') return this._objects;

		const producer = this._producers.find((p) => p.id === id);
		return producer ? producer.count : 0;
	}

	/**
	 *  Tries transacting a resource, only spending if enough cost is present
	 */
	public tryTransaction(costId: string, costAmount: number): boolean {
		const current = this.getResourceAmount(costId);
		if (current >= costAmount) {
			this.modifyResource(costId, -costAmount);
			return true;
		}
		return false;
	}

	// INFO: -----------------------------
	//         producer management
	// -----------------------------------

	private _producers: Producer[] = $state([...INITIAL_PRODUCERS]);

	get producers() {
		return this._producers;
	}

	addProducer(producer: Producer) {
		this._producers.push(producer);
	}

	// INFO: -----------------------------
	//         upgrade management
	// -----------------------------------

	private _upgrades: Upgrade[] = $state([...INITIAL_UPGRADES]);

	get upgrades() {
		return this._upgrades;
	}

	// INFO: ------------------------------
	//          effect management
	// ------------------------------------

	private _effects: Effect[] = $state([]);

	get effects() {
		return this._effects;
	}

	addEffect(effect: Effect) {
		this._effects.push(effect);
		effect.onApply(this);
	}

	removeEffect(effect: Effect) {
		const index = this._effects.indexOf(effect);
		if (index > -1) {
			this._effects.splice(index, 1);
			effect.onRemove(this);
		}
	}

	/**
	 * The total production multiplier from effects
	 */
	get productionMultiplier(): number {
		return this._effects.reduce((acc, effect) => {
			if (effect instanceof ProductionMultiplierEffect) {
				return acc * effect.multiplier;
			}
			return acc;
		}, 1);
	}

	get totalObjectProduction(): number {
		return this._producers.reduce((total, producer) => {
			if (producer.outputResourceId === 'object') {
				return total + producer.totalProduction(this);
			}
			return total;
		}, 0);
	}

	// INFO: -----------------------------------
	//          screen-object management
	// -----------------------------------------

	private _screen_objects: ScreenObject[] = $state([]);

	get screenObjects() {
		return this._screen_objects;
	}

	addScreenObject(object: ScreenObject) {
		this._screen_objects.push(object);
	}

	removeScreenObject(object: ScreenObject) {
		const index = this._screen_objects.indexOf(object);
		if (index > -1) {
			this._screen_objects.splice(index, 1);
		}
	}

	// INFO: ------------------------------
	//         save/load management
	// ------------------------------------

	private _savedObjectCount = $state(this.getSaveObjectCount());

	get savedObjectCount() {
		return this._savedObjectCount;
	}

	public save() {
		const data: GlobalSaveData = {
			objects: this._objects,
			producers: this._producers.map((p) => ({
				id: p.id,
				data: p.save()
			})),
			upgrades: this._upgrades.map((u) => ({
				id: u.id,
				data: u.save()
			}))
		};

		localStorage.setItem(GameState.SAVE_KEY, JSON.stringify(data));
		this._savedObjectCount = this._objects;
		console.log('💾 Game Saved');
	}

	public load() {
		const raw = localStorage.getItem(GameState.SAVE_KEY);
		if (!raw) return;

		try {
			const data: GlobalSaveData = JSON.parse(raw);

			// load currency
			this._objects = data.objects ?? 0;

			// load saved producers
			for (const entry of data.producers) {
				const producerDef = this._producers.find((p) => p.id === entry.id);
				if (producerDef) {
					producerDef.load(entry.data);
				} else {
					console.warn(`⚠️ Save file contains unknown producer: ${entry.id}`);
				}
			}

			// reset transient state before loading upgrades
			this.manualClickPower = GameState.DEFAULT_MANUAL_CLICK_POWER;
			this._effects = [];
			for (const producer of this._producers) {
				producer.multiplier = 1;
			}

			// load saved upgrades
			if (data.upgrades) {
				for (const entry of data.upgrades) {
					const upgradeDef = this._upgrades.find((u) => u.id === entry.id);
					if (upgradeDef) {
						upgradeDef.load(entry.data);
						if (upgradeDef.isPurchased) {
							upgradeDef.onLoad(this);
						}
					} else {
						console.warn(`⚠️ Save file contains unknown upgrade: ${entry.id}`);
					}
				}
			}

			console.log('✅ Game Loaded');
		} catch (e) {
			console.error(`❌ Failed to load save data: ${e}`);
		}
	}

	private getSaveObjectCount(): number | null {
		const raw = localStorage.getItem(GameState.SAVE_KEY);
		if (!raw) return null;

		try {
			const data: GlobalSaveData = JSON.parse(raw);
			return data.objects ?? 0;
		} catch {
			return null;
		}
	}

	public hasSaveData(): boolean {
		return localStorage.getItem(GameState.SAVE_KEY) !== null;
	}
}
