import { ReplyHandler } from './ReplyHandler';
import { Transition } from './Transition';
import { ReplyBuilder } from './ReplyBuilder';
import { SessionState } from './SessionState';

export class TransitionScene<TState, TSceneId> {
    constructor(
        private readonly replyConstructor: ReplyHandler<TState>,
        private readonly transition: Transition<TState, TSceneId>) { }

    appendReply = (replyBuilder: ReplyBuilder, state: TState): void => {
        this.replyConstructor(replyBuilder, state);
    };

    applyTransition(state: TState): Promise<SessionState<TState, TSceneId>> {
        return this.transition.apply(state);
    }
}
