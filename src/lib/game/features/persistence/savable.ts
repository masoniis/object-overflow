/**
 * @template TData The shape of the data saved to disk.
 * @template TContext The dependency, if any, passed during load.
 */
export interface Savable<TData = unknown, TContext = any> {
	saveKey: string;
	save(): TData;
	load(data: TData, context: TContext): void;

	/**
	 *  Optional logic for resetting data before a load
	 */
	reset?(): void;
}

export function isSavable(obj: any): obj is Savable<unknown, unknown> {
	return (
		obj &&
		typeof obj.save === 'function' &&
		typeof obj.load === 'function' &&
		typeof obj.saveKey === 'string'
	);
}
