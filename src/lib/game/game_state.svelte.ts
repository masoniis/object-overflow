import { Producer } from '$lib/game/producer.svelte.js';

interface SavedProducerState {
	id: string;
	count: number;
	multiplier: number;
}

interface SavedGameState {
	objects: number;
	producers: SavedProducerState[];
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
			new Producer('object', 'Basic Object', 10, 1),
			new Producer('object_2', 'Epic Object', 20, 5)
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
		const savedProducers: SavedProducerState[] = this._producers.map((p) => ({
			id: p.id,
			count: p.count,
			multiplier: p.multiplier
		}));

		const savedState: SavedGameState = {
			objects: this._objects,
			producers: savedProducers
		};

		localStorage.setItem(GameState.SAVE_KEY, JSON.stringify(savedState));
		console.log('💾 Game Saved');
	}

	public load() {
		const savedData = localStorage.getItem(GameState.SAVE_KEY);
		if (!savedData) {
			console.log('🤷 No save data found');
			return;
		}

		const savedState: SavedGameState = JSON.parse(savedData);

		this._objects = savedState.objects;

		for (const savedProducer of savedState.producers) {
			const producer = this._producers.find((p) => p.id === savedProducer.id);
			if (producer) {
				producer.count = savedProducer.count;
				producer.multiplier = savedProducer.multiplier;
			}
		}

		console.log('✅ Game Loaded');
	}

	public hasSaveData(): boolean {
		return localStorage.getItem(GameState.SAVE_KEY) !== null;
	}
}
