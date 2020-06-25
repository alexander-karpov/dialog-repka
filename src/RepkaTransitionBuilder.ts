import { RepkaState } from './RepkaState';
import { RepkaScene } from './RepkaScene';
import { TransitionSceneBuilder } from './DialogBuilder/TransitionSceneBuilder';

export type RepkaTransitionBuilder = TransitionSceneBuilder<RepkaState, RepkaScene>;
