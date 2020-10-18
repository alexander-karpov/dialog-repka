import { Input } from './Input';
import { Startable } from './Startable';
import { AsyncResult } from './AsyncResult';

export type InputHandler<TModel, TSceneName extends string> = (
    input: Input,
    state: TModel
) => AsyncResult<Startable<TSceneName> | undefined>;
