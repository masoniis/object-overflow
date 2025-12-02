/**
 * @template TData The shape of the data saved to disk.
 * @template TContext The dependency, if any, passed during load.
 */
export interface Savable<TData = unknown, TContext = any> {
	saveKey: string;
	save(): TData;
	load(data: TData, context: TContext): void;
}
