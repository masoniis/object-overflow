import type { Upgrade, UpgradeSaveData } from './upgrade.svelte';
import type { Savable } from '$lib/game/core/save/savable';
import type { GameState } from '$lib/game/core/state/game_state.svelte';
import { INITIAL_UPGRADES } from './upgrade_data';

export type UpgradeManagerSaveData = {
	id: string;
	data: UpgradeSaveData;
}[];

export class UpgradeManager implements Savable<UpgradeManagerSaveData, GameState> {
	// INFO: ---------------
	//         state
	// ---------------------

	private _upgradeList: Upgrade[] = $state([...INITIAL_UPGRADES]);

	// INFO: -----------------
	//         getters
	// -----------------------

	get upgradeList() {
		return this._upgradeList;
	}

	get length() {
		return this._upgradeList.length;
	}

	/**
	 * Find an upgrade by its unique ID.
	 */
	public getById(id: string): Upgrade | undefined {
		return this._upgradeList.find((u) => u.id === id);
	}

	[Symbol.iterator]() {
		return this._upgradeList[Symbol.iterator]();
	}

	public find(predicate: (upgrade: Upgrade) => boolean): Upgrade | undefined {
		return this._upgradeList.find(predicate);
	}

	public filter(predicate: (upgrade: Upgrade) => boolean): Upgrade[] {
		return this._upgradeList.filter(predicate);
	}

	// INFO: -----------------------
	//         savable logic
	// -----------------------------

	public readonly saveKey = 'upgrades';

	/**
	 * Return just the data needed for serialization.
	 */
	public save(): UpgradeManagerSaveData {
		return this._upgradeList.map((u) => ({
			id: u.id,
			data: u.save()
		}));
	}

	/**
	 * Load data from disk and re-apply purchased effects.
	 * @param context We need GameState here to re-apply effects of purchased upgrades
	 */
	public load(data: UpgradeManagerSaveData, context: GameState): void {
		for (const entry of data) {
			const upgrade = this.getById(entry.id);

			if (upgrade) {
				upgrade.load(entry.data);

				if (upgrade.isPurchased) {
					upgrade.applyEffect(context);
				}
			} else {
				console.warn(`[UpgradeManager] Unknown upgrade ID in save: ${entry.id}`);
			}
		}
	}
}
