import { DialogContext } from './DialogContext';
import { InputData } from './InputData';

export interface Input<TState, TScreenId> {
    apply(
        reqData: InputData,
        context: DialogContext<TState, TScreenId>
    ): DialogContext<TState, TScreenId>;
}
