import { DialogContext } from './DialogContext';
import { Transition } from './Transition';
import { TransitionHandler } from './TransitionHandler';

export class JustTransition<TState, TScreenId> implements Transition<TState, TScreenId> {
    private readonly transitionHandler: TransitionHandler<TState, TScreenId>;

    constructor(transitionHandler: TransitionHandler<TState, TScreenId>) {
        this.transitionHandler = transitionHandler;
    }

    apply(state: TState): DialogContext<TState, TScreenId> {
        const patches: Partial<TState>[] = [];
        const nextScreenId = this.transitionHandler(state, (patch) => patches.push(patch));

        return {
            state: Object.assign({}, state, ...patches),
            $currentScreen: nextScreenId,
        };
    }
}
