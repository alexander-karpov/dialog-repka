import { InputHandler } from './InputHandler';
import { ReplyHandler } from './ReplyHandler';

export interface SceneBuilder<TState, TSceneId> {
    withReply(replyHandler: ReplyHandler<TState>): void;
    withInput(handler: InputHandler<TState, TSceneId>): void;
    withHelp(helpConstructor: ReplyHandler<TState>): void;
    withUnrecognized(unrecognizedConstructor: ReplyHandler<TState>): void;
}
