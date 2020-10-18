import { ReplyHandler } from './ReplyHandler';
import { ReplyBuilder } from './ReplyBuilder';
import { Input } from './Input';
import { InputHandler } from './InputHandler';
import { Startable } from './Startable';

export class SceneProcessor<TModel, TSceneName extends string> {
    constructor(
        private readonly inputHandler: InputHandler<TModel, TSceneName>,
        private readonly replyHandler?: ReplyHandler<TModel>,
        private readonly helpHandler?: ReplyHandler<TModel>,
        private readonly unrecognizedHandler?: ReplyHandler<TModel>
    ) {}

    applyReply = (replyBuilder: ReplyBuilder, state: TModel): void => {
        if (this.replyHandler) {
            this.replyHandler(replyBuilder, state);
        }
    };

    hasReply(): boolean {
        return Boolean(this.replyHandler);
    }

    applyHelp = (replyBuilder: ReplyBuilder, state: TModel): void => {
        const handler = this.helpHandler ?? this.unrecognizedHandler ?? this.replyHandler;

        if (handler) {
            handler(replyBuilder, state);
        }
    };

    applyUnrecognized = (replyBuilder: ReplyBuilder, state: TModel): void => {
        const handler = this.unrecognizedHandler ?? this.helpHandler ?? this.replyHandler;

        if (handler) {
            handler(replyBuilder, state);
        }
    };

    async applyInput(inputData: Input, state: TModel): Promise<Startable<TSceneName> | undefined> {
        return this.inputHandler(inputData, state);
    }
}
