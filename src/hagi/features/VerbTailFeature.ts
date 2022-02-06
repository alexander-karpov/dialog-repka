import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { HagiInput } from './HagiInput';

export class VerbTailFeature extends Feature<HagiInput> {
    static override readonly id = 'VerbTailFeature';

    override implementation({ reversedTokens }: HagiInput, reply: ReplyBuilder): boolean {
        if (this.isMessagesPassed(4)) {
            const verbs = reversedTokens.filter((t) => t[2].includes('VERB'));

            if (verbs.length === 0) {
                return false;
            }

            let reversed = reversedTokens.map((t) => t[1]).join(' ') + '. ';
            reversed += verbs.map((t) => t[1]).join('! ') + '!';

            reply.pitchDownVoice(`${reversed}`);

            return true;
        }

        return false;
    }
}
