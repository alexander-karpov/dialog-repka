import { SessionState } from './SessionState';

export interface Transition<TState, TScreenId> {
    apply(state: TState): Promise<SessionState<TState, TScreenId>>;
}
