import { Startable } from './Startable';

export type DialogsSessionState<TModel, TSceneName extends string> = {
    data: TModel;
    sceneName: Startable<TSceneName>;
};
