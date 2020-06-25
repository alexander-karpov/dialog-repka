import { ReplyHandler } from './ReplyHandler';
import { ReplyBuilder } from './ReplyBuilder';
import { SessionState } from './SessionState';
import { TransitionHandler } from './TransitionHandler';

export class Transition<TState, TSceneId> {
    constructor(
        private readonly replyHandler: ReplyHandler<TState>,
        private readonly transitionHandler: TransitionHandler<TState, TSceneId>) { }

    applyReply = (replyBuilder: ReplyBuilder, state: TState): void => {
        this.replyHandler(replyBuilder, state);
    };

    async applyTransition(state: TState): Promise<SessionState<TState, TSceneId>> {
        const patches: Partial<TState>[] = [];
        const nextSceneId = await this.transitionHandler(state, (patch) => patches.push(patch));

        return {
            state: Object.assign({}, state, ...patches),
            $currentScene: nextSceneId,
        };
    }
}
