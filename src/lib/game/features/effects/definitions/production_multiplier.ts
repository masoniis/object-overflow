import { Effect, type EffectConfig } from '../effect';

export interface ProductionEffectConfig extends EffectConfig {
	multiplier: number;
}

interface ProductionMultiplierSaveData {
	multiplier: number;
	durationRemaining: number | 'infinity';
}

export class ProductionMultiplierEffect extends Effect<ProductionMultiplierSaveData> {
	public readonly multiplier: number;

	public static STRING_TYPE = 'production_multiplier';

	readonly type = ProductionMultiplierEffect.STRING_TYPE;

	constructor(config: ProductionEffectConfig) {
		super(config);
		this.multiplier = config.multiplier;
	}

	saveData(): ProductionMultiplierSaveData {
		// handle infinite duration
		if (this.duration === Infinity) {
			return {
				multiplier: this.multiplier,
				durationRemaining: 'infinity'
			};
		}

		// calculate time elapsed since the effect was applied
		const timeElapsed = Date.now() - this.appliedAt;
		const durationRemaining = Math.max(0, this.duration - timeElapsed);

		return {
			multiplier: this.multiplier,
			durationRemaining: durationRemaining
		};
	}

	static fromSaveData(id: string, data: ProductionMultiplierSaveData): ProductionMultiplierEffect {
		const effect = new ProductionMultiplierEffect({
			id,
			name: 'Production Boost',
			description: `Increases production by ${data.multiplier}x`,
			duration: data.durationRemaining == 'infinity' ? Infinity : data.durationRemaining,
			shouldBeSaved: true,
			multiplier: data.multiplier
		});

		return effect;
	}
}
