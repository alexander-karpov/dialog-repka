import { ReplyBuilder } from '../DialogBuilder/ReplyBuilder';
import { RepkaState } from '../RepkaState';

export function replyWithScorePluralized(reply: ReplyBuilder, { score }: RepkaState) {
    reply.withText([score, '']);
}
