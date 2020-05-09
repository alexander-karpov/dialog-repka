import { DialogContext } from './DialogContext';
import { InputData } from './InputData';

export interface Input<TState, TScreenId> {
    apply(reqData: InputData, state: TState): DialogContext<TState, TScreenId>;
}
