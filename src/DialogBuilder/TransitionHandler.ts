import { SetState } from './DialogBuilder';

export type TransitionHandler<TState, TScreenId> = (
    state:TState,
    setState: SetState<TState>
) => TScreenId;
