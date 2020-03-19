import { DialogContext } from './DialogContext';
import { Transition } from './Transition';

export class NotSpecifiedTransition<TState, TScreenId> implements Transition<TState, TScreenId> {
    apply(context: DialogContext<TState, TScreenId>): DialogContext<TState, TScreenId> {
        return context;
    }
}
