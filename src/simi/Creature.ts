import { Category } from './Category';
import { FeatureValue } from './FeatureValue';
import { Relevance } from './Relevance';
import { Feature } from './Feature';
import { CreatureName } from './CreatureName';

export type FeaturesSet = readonly (readonly [Category, FeatureValue])[];

export abstract class Creature {
    private readonly features: readonly Feature[];

    constructor(private readonly creatureName: CreatureName, features: [Category, FeatureValue][]) {
        this.features = features.map(
            ([category, value]) => new Feature(creatureName, category, value)
        );
    }

    isRelevant(feature: Feature): Relevance {
        if (this.features.find((f) => Feature.isEquals(f, feature))) {
            return Relevance.Fully;
        }

        return Relevance.Irrelevant;
    }
}
