import { ReplyHandler } from './ReplyHandler';
import { Scene } from './Scene';
import { Transition } from './Transition';

export interface DialogParams<TState extends object, TSceneId extends string> {
    scenes: Record<TSceneId, Scene<TState, TSceneId> | Transition<TState, TSceneId>>;
    initialScene: TSceneId;
    initialState: () => TState;
    whatCanYouDo?: ReplyHandler<TState>;
}
