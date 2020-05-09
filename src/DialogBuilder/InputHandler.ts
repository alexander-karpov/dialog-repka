import { DialogContext } from './DialogContext';
import { SetState } from './DialogBuilder';
import { InputData } from './InputData';

export type InputHandler<TState, TScreenId> = (
    reqData: InputData,
    context: DialogContext<TState, TScreenId>,
    setState: SetState<TState>
) => TScreenId;
