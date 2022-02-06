import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';

import { HagiInput } from './HagiInput';

export class DropNoFeature extends Feature<HagiInput> {
    static override readonly id = 'DropNoFeature';

    override implementation({ reversedTokens }: HagiInput, reply: ReplyBuilder): boolean {
        if (this.isMessagesPassed(5) && reversedTokens.length > 1) {
            const withoutNo = reversedTokens.filter((t) => t[1] !== 'не');

            const words = withoutNo.map((t) => t[1]);

            const reversed = words.join(' ');

            reply.pitchDownVoice(`${reversed}.`);
            return true;
        }

        return false;
    }
}
