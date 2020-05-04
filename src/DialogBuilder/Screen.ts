import { ReplyConstructor } from './ReplyConstructor';
import { Transition } from './Transition';
import { ReplyBuilder } from './ReplyBuilder';
import { DialogContext } from './DialogContext';
import { RequestData } from './RequestData';
import { Input } from './Input';

export class Screen<TState, TScreenId> {
    private readonly replyConstructor: ReplyConstructor<TState, TScreenId>;
    private readonly transition: Transition<TState, TScreenId>;
    private readonly input: Input<TState, TScreenId>;
    private readonly helpConstructor: ReplyConstructor<TState, TScreenId>;

    constructor(
        replyConstructor: ReplyConstructor<TState, TScreenId>,
        transition: Transition<TState, TScreenId>,
        input: Input<TState, TScreenId>,
        helpConstructor: ReplyConstructor<TState, TScreenId>,
    ) {
        this.replyConstructor = replyConstructor;
        this.transition = transition;
        this.input = input;
        this.helpConstructor = helpConstructor;
    }

    appendReply = (replyBuilder: ReplyBuilder, context: DialogContext<TState, TScreenId>): void => {
        this.replyConstructor(replyBuilder, context);
    };

    appendHelp = (replyBuilder: ReplyBuilder, context: DialogContext<TState, TScreenId>): void => {
        this.helpConstructor(replyBuilder, context);
    };

    applyTransition(context: DialogContext<TState, TScreenId>): DialogContext<TState, TScreenId> {
        return this.transition.apply(context);
    }

    applyInput(
        reqData: RequestData,
        context: DialogContext<TState, TScreenId>
    ): DialogContext<TState, TScreenId> {
        return this.input.apply(reqData, context);
    }
}
