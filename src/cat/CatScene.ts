import { Scene } from '../DialogBuilder3';
import { CatModel as CatModel } from './CatModel';
import { CatSceneName as CatSceneName } from './CatSceneName';

export type CatScene = Scene<CatModel, CatSceneName>;
