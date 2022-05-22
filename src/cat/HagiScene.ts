import { Scene } from '../DialogBuilder2';
import { CatModel as CatModel } from './CatModel';
import { HagiSceneName as CatSceneName } from './HagiSceneName';

export type CatScene = Scene<CatModel, CatSceneName>;
