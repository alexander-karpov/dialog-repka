import { SetState } from './DialogBuilder';
import { InputData } from './InputData';

export type InputHandler<TState, TSceneId> = (
    inputData: InputData,
    state: TState,
    setState: SetState<TState>
) => TSceneId | undefined | Promise<TSceneId | undefined>;
