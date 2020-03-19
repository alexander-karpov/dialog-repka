import { DialogContext } from './DialogContext';

export interface Transition<TState, TScreenId> {
    apply(context: DialogContext<TState, TScreenId>): DialogContext<TState, TScreenId>;
}
