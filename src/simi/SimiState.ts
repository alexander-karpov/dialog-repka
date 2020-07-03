import { CreatureName } from './CreatureName';
import { FeatureIntent } from './FeatureIntent';

export interface SimiState {
    creature: CreatureName;
    anticreature: CreatureName;
    guess?: FeatureIntent;
}
