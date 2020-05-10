import { InputHandler } from './InputHandler';
import { ReplyConstructor } from './ReplyConstructor';
import { TransitionHandler } from './TransitionHandler';

export interface ScreenBuilder<TState, TScreenId> {
    withReply(replyConstructor: ReplyConstructor<TState>): void;
    withTransition(transition: TransitionHandler<TState, TScreenId>): void;
    withInput(handler: InputHandler<TState, TScreenId>): void;
    withHelp(helpConstructor: ReplyConstructor<TState>): void;
    withUnrecognized(unrecognizedConstructor: ReplyConstructor<TState>): void;
}
