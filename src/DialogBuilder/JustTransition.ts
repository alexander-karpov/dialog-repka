import { SessionState } from './SessionState';
import { Transition } from './Transition';
import { TransitionHandler } from './TransitionHandler';

export class JustTransition<TState, TSceneId> implements Transition<TState, TSceneId> {
    private readonly transitionHandler: TransitionHandler<TState, TSceneId>;

    constructor(transitionHandler: TransitionHandler<TState, TSceneId>) {
        this.transitionHandler = transitionHandler;
    }

    async apply(state: TState): Promise<SessionState<TState, TSceneId>> {
        const patches: Partial<TState>[] = [];
        const nextSceneId = await this.transitionHandler(state, (patch) => patches.push(patch));

        return {
            state: Object.assign({}, state, ...patches),
            $currentScene: nextSceneId,
        };
    }
}
