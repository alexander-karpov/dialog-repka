import { ReplyBuilder } from './ReplyBuilder';

export type ReplyConstructor<TState> = (replyBuilder: ReplyBuilder, state: TState) => void;
