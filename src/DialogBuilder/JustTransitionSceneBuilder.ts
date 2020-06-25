import { TransitionHandler } from './TransitionHandler';
import { ReplyHandler } from './ReplyHandler';
import { JustTransition } from './JustTransition';
import { TransitionSceneBuilder } from './TransitionSceneBuilder';
import { TransitionScene } from './TransitionScene';

export class JustTransitionSceneBuilder<TState, TSceneId>
    implements TransitionSceneBuilder<TState, TSceneId> {
    private replyConstructor?: ReplyHandler<TState>;
    private transitionHandler?: TransitionHandler<TState, TSceneId>;

    withReply(replyConstructor: ReplyHandler<TState>): void {
        if (this.replyConstructor) {
            throw new Error(
                'Обработчик Reply уже задан. Возможно вы вызвали метод withReply повторно.'
            );
        }

        this.replyConstructor = replyConstructor;
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

        const noop = () => { };

        return new TransitionScene<TState, TSceneId>(
            this.replyConstructor || noop,
            new JustTransition(this.transitionHandler)
        );
    }
}
