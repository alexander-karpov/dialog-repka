import { ReplyBuilder } from '../../DialogBuilder2';
import { KnownChar } from '../KnownChar';

export function replyRandomSound(reply: ReplyBuilder, char: KnownChar):void {
    return reply.selectRandom((sound) => reply.withTts(`- ${sound} -`), char.sounds, 1);
}
