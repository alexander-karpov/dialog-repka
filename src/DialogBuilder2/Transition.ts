import { ReplyHandler } from './ReplyHandler';
import { TransitionHandler } from './TransitionHandler';

export interface Transition<TModel, TSceneName extends string> {
    reply?: ReplyHandler<TModel>;
    onTransition: TransitionHandler<TModel, TSceneName>;
}
