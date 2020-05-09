import { TransitionHandler } from './TransitionHandler';
import { InputHandler } from './InputHandler';
import { ReplyConstructor } from './ReplyConstructor';
import { Screen } from './Screen';
import { JustTransition } from './JustTransition';
import { ConstantTransition } from './ConstantTransition';
import { JustInput } from './JustInput';
import { NotSpecifiedInput } from './NotSpecifiedInput';
import { ScreenBuilder } from './ScreenBuilder';

export class JustScreenBuilder<TState, TScreenId> implements ScreenBuilder<TState, TScreenId> {
    private replyConstructor?: ReplyConstructor<TState>;
    private helpConstructor?: ReplyConstructor<TState>;
    private transitionHandler?: TransitionHandler<TState, TScreenId>;
    private inputHandler?: InputHandler<TState, TScreenId>;

    withReply(replyConstructor: ReplyConstructor<TState>): void {
        if (this.replyConstructor) {
            throw new Error(
                'Конструктор ответа уже задан. Возможно вы вызвали метод withReply повторно.'
            );
        }

        this.replyConstructor = replyConstructor;
    }

    withTransition(transitionHandler: TransitionHandler<TState, TScreenId>) {
        if (this.transitionHandler) {
            throw new Error(
                'Обработчик перехода уже задан. Возможно вы вызвали метод withTransition повторно.'
            );
        }

        if (this.inputHandler) {
            throw new Error(
                'Обработчик ввода уже задан. Обработка ввода и переход не могут быть использованы вместе'
            );
        }

        this.transitionHandler = transitionHandler;
    }

    withInput(inputHandler: InputHandler<TState, TScreenId>) {
        if (this.inputHandler) {
            throw new Error(
                'Обработчик ввода уже задан. Возможно вы вызвали метод withInput повторно.'
            );
        }

        if (this.transitionHandler) {
            throw new Error(
                'Обработчик перехода уже задан. Обработка ввода и переход не могут быть использованы вместе'
            );
        }

        this.inputHandler = inputHandler;
    }

    withHelp(helpConstructor: ReplyConstructor<TState>): void {
        if (this.helpConstructor) {
            throw new Error(
                'Конструктор помощи уже задан. Возможно вы вызвали метод withHelp повторно.'
            );
        }

        this.helpConstructor = helpConstructor;
    }

    build(sceneId: TScreenId) {
        if (!this.transitionHandler && !this.inputHandler) {
            throw new Error(
                'Экран как минимум должен содержать либо переход либо обработку ввода.'
            );
        }

        return new Screen<TState, TScreenId>(
            this.replyConstructor || ((_r, _c) => {}),
            this.transitionHandler
                ? new JustTransition(this.transitionHandler)
                : new ConstantTransition(sceneId),
            this.inputHandler ? new JustInput(this.inputHandler) : new NotSpecifiedInput(),
            this.helpConstructor || this.replyConstructor || ((_r, _c) => {})
        );
    }
}
