import { ReplyConstructor } from './ReplyConstructor';
import { Transition } from './Transition';
import { ReplyBuilder } from './ReplyBuilder';
import { DialogContext } from './DialogContext';
import { InputData } from './InputData';
import { Input } from './Input';

export class Screen<TState, TScreenId> {
    private readonly replyConstructor: ReplyConstructor<TState>;
    private readonly transition: Transition<TState, TScreenId>;
    private readonly input: Input<TState, TScreenId>;
    private readonly helpConstructor: ReplyConstructor<TState>;

    constructor(
        replyConstructor: ReplyConstructor<TState>,
        transition: Transition<TState, TScreenId>,
        input: Input<TState, TScreenId>,
        helpConstructor: ReplyConstructor<TState>
    ) {
        this.replyConstructor = replyConstructor;
        this.transition = transition;
        this.input = input;
        this.helpConstructor = helpConstructor;
    }

    appendReply = (replyBuilder: ReplyBuilder, state: TState): void => {
        this.replyConstructor(replyBuilder, state);
    };

    appendHelp = (replyBuilder: ReplyBuilder, state: TState): void => {
        this.helpConstructor(replyBuilder, state);
    };

    applyTransition(state: TState): DialogContext<TState, TScreenId> {
        return this.transition.apply(state);
    }

    applyInput(inputData: InputData, state: TState): DialogContext<TState, TScreenId> {
        return this.input.apply(inputData, state);
    }
}
