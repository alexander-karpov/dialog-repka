import { InputHandler } from './InputHandler';
import { ReplyConstructor } from './ReplyConstructor';
import { TransitionHandler } from './TransitionHandler';

export interface SceneBuilder<TState, TSceneId> {
    withReply(replyConstructor: ReplyConstructor<TState>): void;
    withTransition(transition: TransitionHandler<TState, TSceneId>): void;
    withInput(handler: InputHandler<TState, TSceneId>): void;
    withHelp(helpConstructor: ReplyConstructor<TState>): void;
    withUnrecognized(unrecognizedConstructor: ReplyConstructor<TState>): void;
}
