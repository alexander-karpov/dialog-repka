import { FeaturesSet } from './FeaturesSet';
import { Category } from './Category';
import { Feature } from './Feature';
import { Relevance } from './Relevance';

export abstract class Creature {
    constructor(readonly features: FeaturesSet) {}

    isRelevant(category: Category, feature: Feature): Relevance {
        if (this.features.find((f) => f[0] === category && f[1] === feature)) {
            return Relevance.Fully;
        }

        return Relevance.Irrelevant;
    }
    //     addFeatureExplanation(category: Category, feature: Feature, reply: ReplyBuilder): void;
}


