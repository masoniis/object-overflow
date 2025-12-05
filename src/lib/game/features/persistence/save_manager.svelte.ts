import type { GameState } from '$lib/game/core/state/game_state.svelte';
import type { Savable } from './savable';

export class SaveManager<TContext = GameState> {
	// INFO: ------------------------
	//         config & state
	// ------------------------------

	private static readonly SAVE_KEY = 'object-overflow-save';
	public static readonly TIMESTAMP_KEY = 'saved-at-timestamp';

	// the registry list of things to be saved
	private savables: Savable<any, TContext>[] = [];

	// INFO: ------------------------
	//         static helpers
	// ------------------------------

	/**
	 * Reads the raw JSON from disk without needing to init/access a save manager instance.
	 */
	public static getRawData(): any | null {
		try {
			const raw = localStorage.getItem(SaveManager.SAVE_KEY);
			return raw ? JSON.parse(raw) : null;
		} catch (e) {
			console.error('Failed to read save preview:', e);
			return null;
		}
	}

	// INFO: ------------------------
	//         core lifecycle
	// ------------------------------

	/**
	 * Registers a system to be part of the save/load cycle.
	 */
	public register(savable: Savable<any, TContext>) {
		this.savables.push(savable);
	}

	public save() {
		const globalData: Record<string, unknown> = {};

		// iterate all systems and call their save method to populate the record
		for (const savable of this.savables) {
			try {
				globalData[savable.saveKey] = savable.save();
			} catch (e) {
				console.error(`❌ Failed to save system '${savable.saveKey}':`, e);
			}
		}

		// populate timestamp as well
		globalData[SaveManager.TIMESTAMP_KEY] = Date.now();

		// then write the record to disk
		try {
			const serialized = JSON.stringify(globalData);
			localStorage.setItem(SaveManager.SAVE_KEY, serialized);
			console.log('💾 Game Saved');
		} catch (e) {
			console.error('❌ Failed to write save to disk:', e);
		}
	}

	/**
	 * @param context The GameState instance (or any other dependency) to pass
	 * to the savables.
	 */
	public load(context: TContext) {
		const raw = localStorage.getItem(SaveManager.SAVE_KEY);
		if (!raw) return;

		try {
			const globalData = JSON.parse(raw);

			// iterate all systems and call their reset method if it exists
			for (const savable of this.savables) {
				if (savable.reset) {
					savable.reset();
				}
			}

			// then call their load method with parsed disk data
			for (const savable of this.savables) {
				const data = globalData[savable.saveKey];
				if (data !== undefined) {
					savable.load(data, context);
				}
			}
		} catch (e) {
			console.error(e);
		}
	}

	// INFO: ---------------
	//         utils
	// ---------------------

	public wipeSave() {
		localStorage.removeItem(SaveManager.SAVE_KEY);
	}
}
