import { ReplyHandler } from './ReplyHandler';
import { TransitionHandler } from './TransitionHandler';

export interface TransitionDecl<TState, TSceneId> {
    reply?: ReplyHandler<TState>;
    onTransition: TransitionHandler<TState, TSceneId>;
}
