import { ReplyHandler } from './ReplyHandler';
import { ReplyBuilder } from './ReplyBuilder';
import { TransitionHandler } from './TransitionHandler';
import { Startable } from './Startable';

export class TransitionProcessor<TModel, TSceneName extends string> {
    constructor(
        private readonly transitionHandler: TransitionHandler<TModel, TSceneName>,
        private readonly replyHandler?: ReplyHandler<TModel>
    ) {}

    applyReply = (replyBuilder: ReplyBuilder, state: TModel): void => {
        if (this.replyHandler) {
            this.replyHandler(replyBuilder, state);
        }
    };

    hasReply(): boolean {
        return Boolean(this.replyHandler);
    }

    async applyTransition(state: TModel): Promise<Startable<TSceneName>> {
        return this.transitionHandler(state);
    }
}
