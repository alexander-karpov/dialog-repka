import { DialogContext } from './DialogContext';
import { Transition } from './Transition';
import { TransitionHandler } from './TransitionHandler';

export class JustTransition<TState, TScreenId> implements Transition<TState, TScreenId> {
    private readonly transitionHandler: TransitionHandler<TState, TScreenId>;

    constructor(transitionHandler: TransitionHandler<TState, TScreenId>) {
        this.transitionHandler = transitionHandler;
    }

    apply(context: DialogContext<TState, TScreenId>): DialogContext<TState, TScreenId> {
        const patches: Partial<TState>[] = [];
        const nextScreenId = this.transitionHandler(context, (patch) => patches.push(patch));

        return Object.assign({}, context, ...patches, {
            $currentScreen: nextScreenId,
        });
    }
}
