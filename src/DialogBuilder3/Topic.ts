import { ReplyBuilder, Input } from '../DialogBuilder3';

export type TopicReply = Promise<ReplyBuilder | undefined>;

export interface Topic {
    update(input: Input): TopicReply;
}
