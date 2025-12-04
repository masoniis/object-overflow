import { SaveManager } from '../core/save/save_manager.svelte';
import {
	PlayerStatsManager,
	type PlayerStatsSaveData
} from '../features/player/player_stats_manager.svelte';

/**
 * The shape of the reactive metadata used by the Main Menu.
 */
export interface SaveMetadata {
	hasSave: boolean;
	currencyStored: number;
	lifetimeCurrency: number;
	timestamp: number;
}

// Global reactive state
export const saveMeta = $state<SaveMetadata>({
	hasSave: false,
	currencyStored: 0,
	lifetimeCurrency: 0,
	timestamp: 0
});

/**
 * Reads the raw JSON from disk and updates the reactive meta state.
 */
export function refreshSaveMeta() {
	const rawSaveData = SaveManager.getRawData();

	if (!rawSaveData) {
		saveMeta.hasSave = false;
		saveMeta.currencyStored = 0;
		saveMeta.lifetimeCurrency = 0;
		saveMeta.timestamp = 0;
		return;
	}

	// parse data, casting to player stats
	const playerStats = rawSaveData[PlayerStatsManager.SAVE_KEY] as
		| Partial<PlayerStatsSaveData>
		| undefined;
	const savedTime = rawSaveData[SaveManager.TIMESTAMP_KEY];

	// update ui state
	saveMeta.hasSave = true;
	saveMeta.currencyStored = playerStats?.mainCurrency ?? 0;
	saveMeta.lifetimeCurrency = playerStats?.lifetimeProfits ?? 0;
	saveMeta.timestamp = savedTime;
}
