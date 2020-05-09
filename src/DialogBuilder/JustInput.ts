import { DialogContext } from './DialogContext';
import { InputHandler } from './InputHandler';
import { JustTransition } from './JustTransition';
import { InputData } from './InputData';
import { Input } from './Input';
import { TransitionHandler } from './TransitionHandler';

export class JustInput<TState, TScreenId> implements Input<TState, TScreenId> {
    private readonly inputHandler: InputHandler<TState, TScreenId>;

    constructor(inputHandler: InputHandler<TState, TScreenId>) {
        this.inputHandler = inputHandler;
    }

    apply(inputData: InputData, state: TState): DialogContext<TState, TScreenId> {
        const handler: TransitionHandler<TState, TScreenId> = this.inputHandler.bind(
            this,
            inputData
        );

        const transition = new JustTransition<TState, TScreenId>(handler);

        return transition.apply(state);
    }
}
