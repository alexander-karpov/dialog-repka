import { DialogContext } from './DialogContext';

export interface Transition<TState, TScreenId> {
    apply(state: TState): DialogContext<TState, TScreenId>;
}
