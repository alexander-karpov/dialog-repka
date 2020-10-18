import { InputHandler } from './InputHandler';
import { ReplyHandler } from './ReplyHandler';

export interface Scene<TModel, TSceneName extends string> {
    reply?: ReplyHandler<TModel>;
    help?: ReplyHandler<TModel>;
    unrecognized?: ReplyHandler<TModel>;
    onInput: InputHandler<TModel, TSceneName>;
}
