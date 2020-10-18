import { Startable } from './Startable';
import { AsyncResult } from './AsyncResult';

export type TransitionHandler<TModel, TSceneName extends string> = (
    model: TModel
) => AsyncResult<Startable<TSceneName>>;
