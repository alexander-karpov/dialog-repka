import { ReplyBuilder } from './ReplyBuilder';
import { DialogContext } from './DialogContext';

export type ReplyConstructor<TState, TScreenId> = (
    replyBuilder: ReplyBuilder,
    context: DialogContext<TState, TScreenId>
) => void;
