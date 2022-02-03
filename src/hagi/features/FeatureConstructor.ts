import { Feature } from './Feature';

export type FeatureConstructor = (new () => Feature) & { prototype: Feature; id: string };
