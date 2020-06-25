import { RepkaState } from './RepkaState';
import { RepkaScene } from './RepkaScene';
import { TransitionBuilder } from './DialogBuilder/TransitionBuilder';

export type RepkaTransitionBuilder = TransitionBuilder<RepkaState, RepkaScene>;
