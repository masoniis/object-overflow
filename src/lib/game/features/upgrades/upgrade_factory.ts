import type { Upgrade } from './upgrade.svelte';

export type UpgradeDefinition = {
	id: string;
	name: string;
	description: string;
	cost: number;
	factory: (id: string, name: string, description: string, cost: number) => Upgrade;
};

export function createUpgrade(def: UpgradeDefinition): Upgrade {
	return def.factory(def.id, def.name, def.description, def.cost);
}
