import { Input } from './Input';
import { Startable } from './Startable';
import { AsyncResult } from './AsyncResult';
import { ReplyBuilder } from '.';

export type InputHandler<TModel, TSceneName extends string> = (
    input: Input,
    state: TModel,
    reply: ReplyBuilder
) => AsyncResult<Startable<TSceneName> | undefined>;
