import { SessionState } from './SessionState';
import { InputHandler } from './InputHandler';
import { JustTransition } from './JustTransition';
import { InputData } from './InputData';
import { Input } from './Input';
import { TransitionHandler } from './TransitionHandler';

export class JustInput<TState, TSceneId> implements Input<TState, TSceneId> {
    private readonly inputHandler: InputHandler<TState, TSceneId>;

    constructor(inputHandler: InputHandler<TState, TSceneId>) {
        this.inputHandler = inputHandler;
    }

    async apply(inputData: InputData, state: TState): Promise<SessionState<TState, TSceneId | undefined>> {
        const handler: TransitionHandler<TState, TSceneId | undefined> = this.inputHandler.bind(
            this,
            inputData
        );

        const transition = new JustTransition<TState, TSceneId | undefined>(handler);

        return transition.apply(state);
    }
}
