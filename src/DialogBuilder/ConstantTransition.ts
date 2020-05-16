import { SessionState } from './SessionState';
import { Transition } from './Transition';

/**
 * Не изменяет state. Всегда возвращает один и тот же sceneId
 */
export class ConstantTransition<TState, TScreenId> implements Transition<TState, TScreenId> {
    constructor(private readonly sceneId: TScreenId) {}

    apply(state: TState): Promise<SessionState<TState, TScreenId>> {
        return Promise.resolve({
            state: state,
            $currentScreen: this.sceneId,
        });
    }
}
