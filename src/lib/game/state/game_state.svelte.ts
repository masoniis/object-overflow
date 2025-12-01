import { Producer, type ProducerSaveData } from '$lib/game/state/producers/producer.svelte.js';

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

		this._producers = [
			new Producer('basic_object', 'Basic Object', 10, 1),
			new Producer('epic_object', 'Epic Object', 20, 2),
			new Producer('super_epic_object', 'Super Epic Object', 50, 5),
			new Producer('insanely_epic_object', 'Insanely Epic Object', 100, 10)
		];
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

	private _producers: Producer[] = $state([]);

	get producers() {
		return this._producers;
	}

	addProducer(producer: Producer) {
		this._producers.push(producer);
	}

	// INFO: ------------------------------
	//         save/load management
	// ------------------------------------

	public save() {
		const data: GlobalSaveData = {
			objects: this._objects,
			producers: this._producers.map((p) => ({
				id: p.id,
				data: p.save()
			}))
		};

		localStorage.setItem(GameState.SAVE_KEY, JSON.stringify(data));
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

	public hasSaveData(): boolean {
		return localStorage.getItem(GameState.SAVE_KEY) !== null;
	}
}
