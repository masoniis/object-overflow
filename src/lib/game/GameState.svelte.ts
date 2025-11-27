/// The core state singleton that represents the game (currency, income, etc)
export class GameState {
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
	//         GameState management
	// ------------------------------------

	private _objects = $state(0);

	get objects() {
		return this._objects;
	}

	addObjects(amount: number) {
		this._objects += amount;
	}
}
