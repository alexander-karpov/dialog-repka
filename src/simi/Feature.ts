import { Category } from './Category';
import { CreatureName } from './CreatureName';
import { FeatureValue } from './FeatureValue';

/**
 * ВНИМАНИЕ: Класс сериализуется в state.
 * Он не должен содержать методов экземпляра.
 */
export class Feature {
    constructor(
        readonly creature: CreatureName,
        readonly category: Category,

        readonly value: FeatureValue
    ) {}

    static isEquals(left: Feature, right: Feature) {
        return (
            left.creature === right.creature &&
            left.category === right.category &&
            left.value === right.value
        );
    }
}
