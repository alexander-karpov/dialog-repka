import { SetState } from './DialogBuilder';
import { DialogContext } from './DialogContext';
export type TransitionHandler<TState, TScreenId> = (context: DialogContext<TState, TScreenId>, setState: SetState<TState>) => TScreenId;
