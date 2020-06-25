import { ReplyHandler } from './ReplyHandler';
import { TransitionHandler } from './TransitionHandler';

export interface TransitionBuilder<TState, TSceneId> {
    withReply(replyHandler: ReplyHandler<TState>): void;
    withTransition(transition: TransitionHandler<TState, TSceneId>): void;
}
