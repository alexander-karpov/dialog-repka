import { DialogContext } from './DialogContext';
import { SetState } from './DialogBuilder';

export type InputHandler<TState, TScreenId> = (
    command: string,
    context: DialogContext<TState, TScreenId>,
    setState: SetState<TState>
) => TScreenId;
