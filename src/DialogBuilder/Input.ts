import { SessionState } from './SessionState';
import { InputData } from './InputData';

export interface Input<TState, TSceneId> {
    apply(
        inputData: InputData,
        state: TState
    ): Promise<SessionState<TState, TSceneId | undefined>>;
}
