import { ReplyBuilder } from './ReplyBuilder';

export type ReplyHandler<TModel> = (replyBuilder: ReplyBuilder, state: TModel) => void;
