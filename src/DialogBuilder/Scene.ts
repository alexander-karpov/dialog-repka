import { ReplyHandler } from './ReplyHandler';
import { ReplyBuilder } from './ReplyBuilder';
import { SessionState } from './SessionState';
import { InputData } from './InputData';
import { InputHandler } from './InputHandler';

export class Scene<TState, TSceneId> {
    constructor(
        private readonly replyHandler: ReplyHandler<TState>,
        private readonly inputHandler: InputHandler<TState, TSceneId>,
        private readonly helpHandler?: ReplyHandler<TState>,
        private readonly unrecognizedHandler?: ReplyHandler<TState>
    ) {}

    appendReply = (replyBuilder: ReplyBuilder, state: TState): void => {
        this.replyHandler(replyBuilder, state);
    };

    appendHelp = (replyBuilder: ReplyBuilder, state: TState): void => {
        const handler = this.helpHandler || this.unrecognizedHandler || this.replyHandler;

        handler(replyBuilder, state);
    };

    appendUnrecognized = (replyBuilder: ReplyBuilder, state: TState): void => {
        const handler = this.unrecognizedHandler || this.helpHandler || this.replyHandler;

        handler(replyBuilder, state);
    };

    async applyInput(
        inputData: InputData,
        state: TState
    ): Promise<SessionState<TState, TSceneId | undefined>> {
        const patches: Partial<TState>[] = [];

        const nextSceneId = await this.inputHandler(inputData, state, (patch) =>
            patches.push(patch)
        );

        return {
            state: Object.assign({}, state, ...patches),
            $currentScene: nextSceneId,
        };
    }
}
