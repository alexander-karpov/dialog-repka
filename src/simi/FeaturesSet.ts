import { Feature } from './Feature';
import { Category } from './Category';

export type FeaturesSet = readonly (readonly [Category, Feature])[];
