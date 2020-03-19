import { RepkaDialogContext } from '../RepkaDialogContext';
import { ReplyBuilder } from '../DialogBuilder/ReplyBuilder';

export function replyWithScorePluralized(reply: ReplyBuilder, { score }: RepkaDialogContext) {
    reply.withText([score, '']);
}
