import { SetState } from './DialogBuilder';

export type TransitionHandler<TState, TSceneId> = (
    state:TState,
    setState: SetState<TState>
) => TSceneId | Promise<TSceneId>;
