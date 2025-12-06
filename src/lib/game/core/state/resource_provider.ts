/** An interface for classes to implement that provide
 *  particular resources to the global game state
 */
export interface ResourceProvider {
	/** Returns true if this class handles the given resource ID */
	ownsResource(id: string): boolean;

	/** Gets the current value of the resource requested */
	getResourceAmount(id: string): number;

	/** Modifies the resource value by an amount */
	modifyResource(id: string, amount: number): void;
}

export function isResourceProvider(obj: any): obj is ResourceProvider {
	return (
		obj &&
		typeof obj.ownsResource === 'function' &&
		typeof obj.getResourceAmount === 'function' &&
		typeof obj.modifyResource === 'function'
	);
}
