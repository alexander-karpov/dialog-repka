import { CreatureName } from './CreatureName';
import { Category } from './Category';
import { Feature } from './Feature';

export interface FeatureIntent {
    category: Category;
    creature?: CreatureName;
    feature: Feature;
    anticreature?:CreatureName;
    antifeature?: Feature;
}
