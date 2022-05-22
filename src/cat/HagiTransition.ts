import { Transition } from '../DialogBuilder2';
import { CatModel } from './CatModel';
import { HagiSceneName } from './HagiSceneName';

export type HagiTransition = Transition<CatModel, HagiSceneName>;
