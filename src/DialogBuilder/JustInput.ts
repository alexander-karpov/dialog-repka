import { DialogContext } from './DialogContext';
import { InputHandler } from './InputHandler';
import { JustTransition } from './JustTransition';
import { InputData } from './InputData';

export class JustInput<TState, TScreenId> {
    private readonly inputHandler: InputHandler<TState, TScreenId>;
    constructor(inputHandler: InputHandler<TState, TScreenId>) {
        this.inputHandler = inputHandler;
    }
    apply(
        reqData: InputData,
        context: DialogContext<TState, TScreenId>
    ): DialogContext<TState, TScreenId> {
        const transition = new JustTransition<TState, TScreenId>(
            this.inputHandler.bind(this, reqData)
        );
        return transition.apply(context);
    }
}
