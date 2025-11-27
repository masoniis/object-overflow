import { Producer } from '$lib/game/producer.svelte.js';

/// The core state singleton that represents the game (currency, income, etc)
export class GameState {
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
}
