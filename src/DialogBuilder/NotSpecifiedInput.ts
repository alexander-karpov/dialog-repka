import { SessionState } from './SessionState';
import { Input } from './Input';

export class NotSpecifiedInput<TState, TScreenId> implements Input<TState, TScreenId> {
    apply(): Promise<SessionState<TState, TScreenId | undefined>> {
        throw new Error('Переход не задан.');
    }
}
