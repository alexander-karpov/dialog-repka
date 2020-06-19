import { SessionState } from './SessionState';
import { Transition } from './Transition';

/**
 * Не изменяет state. Всегда возвращает один и тот же sceneId
 */
export class ConstantTransition<TState, TSceneId> implements Transition<TState, TSceneId> {
    constructor(private readonly sceneId: TSceneId) {}

    apply(state: TState): Promise<SessionState<TState, TSceneId>> {
        return Promise.resolve({
            state: state,
            $currentScene: this.sceneId,
        });
    }
}
