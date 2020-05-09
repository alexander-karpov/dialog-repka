import { SetState } from './DialogBuilder';
import { InputData } from './InputData';

export type InputHandler<TState, TScreenId> = (
    inputData: InputData,
    state: TState,
    setState: SetState<TState>
) => TScreenId;
