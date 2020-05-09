import { SessionState } from './SessionState';
import { Input } from './Input';

export class NotSpecifiedInput<TState, TScreenId> implements Input<TState, TScreenId> {
    apply(): SessionState<TState, TScreenId> {
        throw new Error('Переход не задан.');
    }
}
