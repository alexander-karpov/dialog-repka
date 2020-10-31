import { ReplyHandler } from './ReplyHandler';
import { Scene } from './Scene';
import { Transition } from './Transition';
import { Startable } from './Startable';
import { Ending } from './Ending';
import { RandomProvider } from './RandomProvider';

export interface DialogParams<TSceneName extends string, TModel> {
    scenes: Record<
        Startable<TSceneName>,
        Scene<TModel, TSceneName> | Transition<TModel, TSceneName> | Ending<TModel>
    >;
    whatCanYouDo?: ReplyHandler<TModel>;
    timeout?: ReplyHandler<TModel>;
    random: RandomProvider
}
