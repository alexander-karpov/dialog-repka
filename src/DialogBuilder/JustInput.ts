import { DialogContext } from './DialogContext';
import { InputHandler } from './InputHandler';
import { JustTransition } from './JustTransition';
export class JustInput<TState, TScreenId> {
    private readonly inputHandler: InputHandler<TState, TScreenId>;
    constructor(inputHandler: InputHandler<TState, TScreenId>) {
        this.inputHandler = inputHandler;
    }
    apply(
        command: string,
        context: DialogContext<TState, TScreenId>
    ): DialogContext<TState, TScreenId> {
        const transition = new JustTransition<TState, TScreenId>(
            this.inputHandler.bind(this, command)
        );
        return transition.apply(context);
    }
}
