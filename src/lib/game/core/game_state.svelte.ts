import { Producer, type ProducerSaveData } from '$lib/game/models/producers/producer.svelte';
import type { Effect } from '$lib/game/models/effects/effect.svelte';
import { ProductionMultiplierEffect } from '$lib/game/models/effects/definitions/production_multiplier';
import type { ScreenObject } from '$lib/game/models/screen_objects/screen_object';
import { INITIAL_PRODUCERS } from '../data/initial_producers';

/// The shape of the global save file
interface GlobalSaveData {
	objects: number;
	producers: { id: string; data: ProducerSaveData }[];
}

/// The core state singleton that represents the game (currency, income, etc)
export class GameState {
	private static readonly SAVE_KEY = 'object-overflow-save';

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

	// INFO: ----------------------------
	//         objects management
	// ----------------------------------

	private _objects = $state(0);

	get objects() {
		return this._objects;
	}

	addObjects(amount: number) {
		this._objects += amount;
	}

	removeObjects(amount: number) {
		this._objects -= amount;
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

			console.log('✅ Game Loaded');
		} catch (e) {
			console.error('❌ Failed to load save data:', e);
		}
	}

	private getSaveObjectCount(): number | null {
		const raw = localStorage.getItem(GameState.SAVE_KEY);
		if (!raw) return null;

		try {
			const data: GlobalSaveData = JSON.parse(raw);
			return data.objects ?? 0;
		} catch (e) {
			return null;
		}
	}

	public hasSaveData(): boolean {
		return localStorage.getItem(GameState.SAVE_KEY) !== null;
	}
}
