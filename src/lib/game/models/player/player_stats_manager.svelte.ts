import type { Savable } from '../../core/save/savable';

export interface PlayerStatsSaveData {
	objects: number;
	lifetimeObjects: number;
	manualClickPower: number;
}

export class PlayerStatsManager implements Savable {
	public static readonly SAVE_KEY = 'player_stats';
	private static DEFAULT_MANUAL_CLICK_POWER = 1;

	// INFO: ---------------
	//         state
	// ---------------------

	// economy resources
	private _objects = $state(0);
	private _lifetimeObjects = $state(0);

	// economy stats
	private _manualClickPower = $state(PlayerStatsManager.DEFAULT_MANUAL_CLICK_POWER);

	// getters
	get objects() {
		return this._objects;
	}
	get lifetimeObjects() {
		return this._lifetimeObjects;
	}
	get manualClickPower() {
		return this._manualClickPower;
	}

	// INFO: -------------------
	//         modifiers
	// -------------------------

	/**
	 * Add objects to the balance.
	 */
	addObjects(amount: number) {
		if (amount > 0) {
			this._objects += amount;
			this._lifetimeObjects += amount;
		} else {
			// amount is negative, shouldn't modify lifetime earnings
			this._objects += amount;
		}
	}

	/**
	 * Increases base click power
	 */
	addClickPower(amount: number) {
		this._manualClickPower += amount;
	}

	// INFO: -----------------------
	//         savable logic
	// -----------------------------

	public readonly saveKey = PlayerStatsManager.SAVE_KEY;

	save(): PlayerStatsSaveData {
		return {
			objects: this._objects,
			lifetimeObjects: this._lifetimeObjects,
			manualClickPower: this._manualClickPower
		};
	}

	load(data: PlayerStatsSaveData): void {
		this._objects = data.objects ?? 0;
		this._lifetimeObjects = data.lifetimeObjects ?? data.objects ?? 0;
		this._manualClickPower = data.manualClickPower ?? PlayerStatsManager.DEFAULT_MANUAL_CLICK_POWER;
	}
}
