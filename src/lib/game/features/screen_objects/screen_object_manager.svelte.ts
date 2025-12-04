import type { ScreenObject } from './screen_object';

export class ScreenObjectManager {
	// the visual list of objects currently on screen
	private _screenObjectList: ScreenObject[] = $state([]);

	// INFO: -----------------
	//         reading
	// -----------------------

	get length() {
		return this._screenObjectList.length;
	}

	[Symbol.iterator]() {
		return this._screenObjectList[Symbol.iterator]();
	}

	public find(predicate: (object: ScreenObject) => boolean): ScreenObject | undefined {
		return this._screenObjectList.find(predicate);
	}

	public filter(predicate: (object: ScreenObject) => boolean): ScreenObject[] {
		return this._screenObjectList.filter(predicate);
	}

	// INFO: -------------------
	//         modifying
	// -------------------------

	/**
	 * Adds the specified object to the game if it exists.
	 */
	add(object: ScreenObject) {
		this._screenObjectList.push(object);
	}

	/**
	 * Removes the specified object from the game if it exists.
	 */
	remove(object: ScreenObject) {
		const index = this._screenObjectList.indexOf(object);
		if (index > -1) {
			this._screenObjectList.splice(index, 1);
		}
	}

	/**
	 * Removes items that match the predicate with an optional callback to run on removal.
	 */
	prune(predicate: (obj: ScreenObject) => boolean, onRemove?: (obj: ScreenObject) => void) {
		for (let i = this._screenObjectList.length - 1; i >= 0; i--) {
			const obj = this._screenObjectList[i];
			if (predicate(obj)) {
				if (onRemove) onRemove(obj);
				this._screenObjectList.splice(i, 1);
			}
		}
	}

	/**
	 * Removes all objects from the screen.
	 */
	clear() {
		this._screenObjectList = [];
	}
}
