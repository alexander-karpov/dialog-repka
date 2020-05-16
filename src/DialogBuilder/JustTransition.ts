import { SessionState } from './SessionState';
import { Transition } from './Transition';
import { TransitionHandler } from './TransitionHandler';

export class JustTransition<TState, TScreenId> implements Transition<TState, TScreenId> {
    private readonly transitionHandler: TransitionHandler<TState, TScreenId>;

    constructor(transitionHandler: TransitionHandler<TState, TScreenId>) {
        this.transitionHandler = transitionHandler;
    }

    async apply(state: TState): Promise<SessionState<TState, TScreenId>> {
        const patches: Partial<TState>[] = [];
        const nextScreenId = await this.transitionHandler(state, (patch) => patches.push(patch));

        return {
            state: Object.assign({}, state, ...patches),
            $currentScreen: nextScreenId,
        };
    }
}
