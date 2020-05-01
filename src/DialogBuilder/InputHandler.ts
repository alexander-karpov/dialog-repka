import { DialogContext } from './DialogContext';
import { SetState } from './DialogBuilder';
import { RequestData } from './RequestData';

export type InputHandler<TState, TScreenId> = (
    reqData: RequestData,
    context: DialogContext<TState, TScreenId>,
    setState: SetState<TState>
) => TScreenId;
