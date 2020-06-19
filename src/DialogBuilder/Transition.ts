import { SessionState } from './SessionState';

export interface Transition<TState, TSceneId> {
    apply(state: TState): Promise<SessionState<TState, TSceneId>>;
}
