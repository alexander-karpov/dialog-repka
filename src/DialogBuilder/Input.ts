import { DialogContext } from './DialogContext';
import { RequestData } from './RequestData';

export interface Input<TState, TScreenId> {
    apply(
        reqData: RequestData,
        context: DialogContext<TState, TScreenId>
    ): DialogContext<TState, TScreenId>;
}
