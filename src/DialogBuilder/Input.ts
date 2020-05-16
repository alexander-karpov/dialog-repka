import { SessionState } from './SessionState';
import { InputData } from './InputData';

export interface Input<TState, TScreenId> {
    apply(
        inputData: InputData,
        state: TState
    ): Promise<SessionState<TState, TScreenId | undefined>>;
}
