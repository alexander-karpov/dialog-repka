import { ReplyHandler } from './ReplyHandler';
import { TransitionHandler } from './TransitionHandler';

export interface TransitionSceneBuilder<TState, TSceneId> {
    withReply(replyConstructor: ReplyHandler<TState>): void;
    withTransition(transition: TransitionHandler<TState, TSceneId>): void;
}
