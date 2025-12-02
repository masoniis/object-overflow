import type { ScreenObject } from './screen_object';

export class ScreenObjectManager {
	// The visual list of objects currently on stage
	private _list: ScreenObject[] = $state([]);

	get list() {
		return this._list;
	}

	get length() {
		return this._list.length;
	}

	[Symbol.iterator]() {
		return this._list[Symbol.iterator]();
	}

	public find(predicate: (object: ScreenObject) => boolean): ScreenObject | undefined {
		return this._list.find(predicate);
	}

	public filter(predicate: (object: ScreenObject) => boolean): ScreenObject[] {
		return this._list.filter(predicate);
	}

	add(object: ScreenObject) {
		this._list.push(object);
	}

	remove(object: ScreenObject) {
		const index = this._list.indexOf(object);
		if (index > -1) {
			this._list.splice(index, 1);
		}
	}

	/**
	 * Removes all objects from the screen.
	 * Useful when changing scenes or performing a 'Hard Reset'.
	 */
	clear() {
		this._list = [];
	}
}
