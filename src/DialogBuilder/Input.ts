import { DialogContext } from './DialogContext';

export interface Input<TState, TScreenId> {
    apply(
        command: string,
        context: DialogContext<TState, TScreenId>
    ): DialogContext<TState, TScreenId>;
}
