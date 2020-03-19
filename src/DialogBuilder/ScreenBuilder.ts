import { TransitionHandler } from "./TransitionHandler";
import { InputHandler } from './InputHandler';
import { ReplyConstructor } from './ReplyConstructor';

export interface ScreenBuilder<TState, TScreenId> {
    withReply(replyConstructor: ReplyConstructor<TState, TScreenId>): void;
    withTransition(transition: TransitionHandler<TState, TScreenId>): void;
    withInput(handler: InputHandler<TState, TScreenId>): void;
}
