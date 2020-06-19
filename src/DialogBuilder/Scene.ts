import { ReplyConstructor } from './ReplyConstructor';
import { Transition } from './Transition';
import { ReplyBuilder } from './ReplyBuilder';
import { SessionState } from './SessionState';
import { InputData } from './InputData';
import { Input } from './Input';

export class Scene<TState, TSceneId> {
    constructor(
        private readonly replyConstructor: ReplyConstructor<TState>,
        private readonly transition: Transition<TState, TSceneId>,
        private readonly input: Input<TState, TSceneId>,
        private readonly helpConstructor: ReplyConstructor<TState>,
        private readonly unrecognizedConstructor: ReplyConstructor<TState>
    ) {}

    appendReply = (replyBuilder: ReplyBuilder, state: TState): void => {
        this.replyConstructor(replyBuilder, state);
    };

    appendHelp = (replyBuilder: ReplyBuilder, state: TState): void => {
        this.helpConstructor(replyBuilder, state);
    };

    appendUnrecognized = (replyBuilder: ReplyBuilder, state: TState): void => {
        this.unrecognizedConstructor(replyBuilder, state);
    };

    applyTransition(state: TState): Promise<SessionState<TState, TSceneId>> {
        return this.transition.apply(state);
    }

    applyInput(inputData: InputData, state: TState): Promise<SessionState<TState, TSceneId | undefined>> {
        return this.input.apply(inputData, state);
    }
}
