import { TransitionHandler } from './TransitionHandler';
import { ReplyHandler } from './ReplyHandler';
import { Transition } from './TransitionScene';

export class TransitionBuilder<TState, TSceneId> {
    private replyHandler?: ReplyHandler<TState>;
    private transitionHandler?: TransitionHandler<TState, TSceneId>;

    withReply(replyHandler: ReplyHandler<TState>): void {
        if (this.replyHandler) {
            throw new Error(
                'Обработчик Reply уже задан. Возможно вы вызвали метод withReply повторно.'
            );
        }

        this.replyHandler = replyHandler;
    }

    withTransition(transitionHandler: TransitionHandler<TState, TSceneId>) {
        if (this.transitionHandler) {
            throw new Error(
                'Обработчик Transition уже задан. Возможно вы вызвали метод withTransition повторно.'
            );
        }

        this.transitionHandler = transitionHandler;
    }

    build() {
        if (!this.transitionHandler) {
            throw new Error('Сцена должна содержать хотя бы один из обработчиков: Transition');
        }

        const noop = () => {};

        return new Transition<TState, TSceneId>(
            this.replyHandler || noop,
            this.transitionHandler
        );
    }
}
