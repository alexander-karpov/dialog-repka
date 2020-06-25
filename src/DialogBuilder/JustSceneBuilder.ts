import { InputHandler } from './InputHandler';
import { ReplyHandler } from './ReplyHandler';
import { Scene } from './Scene';
import { SceneBuilder } from './SceneBuilder';

export class JustSceneBuilder<TState, TSceneId> implements SceneBuilder<TState, TSceneId> {
    private replyHandler?: ReplyHandler<TState>;
    private helpConstructor?: ReplyHandler<TState>;
    private unrecognizedConstructor?: ReplyHandler<TState>;
    private inputHandler?: InputHandler<TState, TSceneId>;

    withReply(replyHandler: ReplyHandler<TState>): void {
        if (this.replyHandler) {
            throw new Error(
                'Обработчик Reply уже задан. Возможно вы вызвали метод withReply повторно.'
            );
        }

        this.replyHandler = replyHandler;
    }

    withInput(inputHandler: InputHandler<TState, TSceneId>) {
        if (this.inputHandler) {
            throw new Error(
                'Обработчик Input уже задан. Возможно вы вызвали метод withInput повторно.'
            );
        }

        this.inputHandler = inputHandler;
    }

    withHelp(helpConstructor: ReplyHandler<TState>): void {
        if (this.helpConstructor) {
            throw new Error(
                'Обработчик Help уже задан. Возможно вы вызвали метод withHelp повторно.'
            );
        }

        this.helpConstructor = helpConstructor;
    }

    withUnrecognized(unrecognizedConstructor: ReplyHandler<TState>): void {
        if (this.unrecognizedConstructor) {
            throw new Error(
                'Обработчик Unrecognized уже задан. Возможно вы вызвали метод withHelp повторно.'
            );
        }

        this.unrecognizedConstructor = unrecognizedConstructor;
    }

    build() {
        const noop = () => {};

        if (!this.inputHandler) {
            throw new Error('Сцена должна содержать хотя бы один из обработчиков: Transition');
        }

        return new Scene<TState, TSceneId>(
            this.replyHandler || noop,
            this.inputHandler,
            this.helpConstructor,
            this.unrecognizedConstructor
        );
    }
}
