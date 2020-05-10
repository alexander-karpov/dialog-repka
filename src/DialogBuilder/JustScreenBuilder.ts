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
    private unrecognizedConstructor?: ReplyConstructor<TState>;
    private transitionHandler?: TransitionHandler<TState, TScreenId>;
    private inputHandler?: InputHandler<TState, TScreenId>;

    withReply(replyConstructor: ReplyConstructor<TState>): void {
        if (this.replyConstructor) {
            throw new Error(
                'Обработчик Reply уже задан. Возможно вы вызвали метод withReply повторно.'
            );
        }

        this.replyConstructor = replyConstructor;
    }

    withTransition(transitionHandler: TransitionHandler<TState, TScreenId>) {
        if (this.transitionHandler) {
            throw new Error(
                'Обработчик Transition уже задан. Возможно вы вызвали метод withTransition повторно.'
            );
        }

        if (this.inputHandler) {
            throw new Error(
                'Обработчик Input уже задан. Обработка ввода и переход не могут быть использованы вместе'
            );
        }

        this.transitionHandler = transitionHandler;
    }

    withInput(inputHandler: InputHandler<TState, TScreenId>) {
        if (this.inputHandler) {
            throw new Error(
                'Обработчик Input уже задан. Возможно вы вызвали метод withInput повторно.'
            );
        }

        if (this.transitionHandler) {
            throw new Error(
                'Обработчик Transition уже задан. Обработка ввода и переход не могут быть использованы вместе'
            );
        }

        this.inputHandler = inputHandler;
    }

    withHelp(helpConstructor: ReplyConstructor<TState>): void {
        if (this.helpConstructor) {
            throw new Error(
                'Обработчик Help уже задан. Возможно вы вызвали метод withHelp повторно.'
            );
        }

        this.helpConstructor = helpConstructor;
    }


    withUnrecognized(unrecognizedConstructor: ReplyConstructor<TState>): void {
        if (this.unrecognizedConstructor) {
            throw new Error(
                'Обработчик Unrecognized уже задан. Возможно вы вызвали метод withHelp повторно.'
            );
        }

        this.unrecognizedConstructor = unrecognizedConstructor;
    }

    build(sceneId: TScreenId) {
        if (!this.transitionHandler && !this.inputHandler) {
            throw new Error(
                'Сцена должна содержать хотя бы один из обработчиков: Transition, Input'
            );
        }

        if (this.helpConstructor && !this.inputHandler) {
            throw new Error(
                'Обработчик Help имеет смысл только когда определён обработчик Input'
            );
        }

        if (this.unrecognizedConstructor && !this.inputHandler) {
            throw new Error(
                'Обработчик Unrecognized имеет смысл только когда определён обработчик Input'
            );
        }

        const noop = () => {};

        return new Screen<TState, TScreenId>(
            this.replyConstructor || noop,
            this.transitionHandler
                ? new JustTransition(this.transitionHandler)
                : new ConstantTransition(sceneId),
            this.inputHandler ? new JustInput(this.inputHandler) : new NotSpecifiedInput(),
            this.helpConstructor || this.replyConstructor || noop,
            this.unrecognizedConstructor || this.helpConstructor || this.replyConstructor || noop
        );
    }
}
