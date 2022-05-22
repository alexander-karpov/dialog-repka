import { Input } from '../../DialogBuilder2/Input';
import { Feature } from './Feature';

export type FeatureConstructor<T extends Input> = (new () => Feature<T>) & {
    prototype: Feature<T>;
    id: `${string}Feature`;
};
