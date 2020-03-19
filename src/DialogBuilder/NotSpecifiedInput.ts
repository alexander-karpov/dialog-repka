import { DialogContext } from './DialogContext';
import { Input } from './Input';

export class NotSpecifiedInput<TState, TScreenId> implements Input<TState, TScreenId> {
    apply(): DialogContext<TState, TScreenId> {
        throw new Error('Переход не задан.');
    }
}
