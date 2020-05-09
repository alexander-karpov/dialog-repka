import { DialogContext } from './DialogContext';
import { Transition } from './Transition';

/**
 * Не изменяет state. Всегда возвращает один и тот же sceneId
 */
export class ConstantTransition<TState, TScreenId> implements Transition<TState, TScreenId> {
    constructor(private readonly sceneId: TScreenId) {}

    apply(state: TState): DialogContext<TState, TScreenId> {
        return {
            state: state,
            $currentScreen: this.sceneId,
        };
    }
}
