import type { Savable } from '../../core/save/savable';

export interface PlayerStatsSaveData {
	mainCurrency: number;
	lifetimeProfits: number;
	// note: manual click power isn't saved since it is derived
	// state from other stuff like upgrades
}

export class PlayerStatsManager implements Savable {
	public static readonly SAVE_KEY = 'player_stats';
	private static DEFAULT_MANUAL_CLICK_POWER = 1;

	// INFO: ---------------
	//         state
	// ---------------------

	// economy resources
	private _mainCurrency = $state(0);
	private _lifetimeProfits = $state(0);

	// economy stats
	private _manualClickPower = $state(PlayerStatsManager.DEFAULT_MANUAL_CLICK_POWER);

	// getters
	get objects() {
		return this._mainCurrency;
	}
	get lifetimeObjects() {
		return this._lifetimeProfits;
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
	addMainCurrency(amount: number) {
		if (amount > 0) {
			this._mainCurrency += amount;
			this._lifetimeProfits += amount;
		} else {
			// amount is negative, shouldn't modify lifetime earnings
			this._mainCurrency += amount;
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
			mainCurrency: this._mainCurrency,
			lifetimeProfits: this._lifetimeProfits
		};
	}

	public reset(): void {
		this._manualClickPower = PlayerStatsManager.DEFAULT_MANUAL_CLICK_POWER;
	}

	load(data: PlayerStatsSaveData): void {
		this._mainCurrency = data.mainCurrency ?? 0;
		this._lifetimeProfits = data.lifetimeProfits ?? data.mainCurrency ?? 0;
	}
}
