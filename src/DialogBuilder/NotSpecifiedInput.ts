import { SessionState } from './SessionState';
import { Input } from './Input';

export class NotSpecifiedInput<TState, TSceneId> implements Input<TState, TSceneId> {
    apply(): Promise<SessionState<TState, TSceneId | undefined>> {
        throw new Error('Переход не задан.');
    }
}
