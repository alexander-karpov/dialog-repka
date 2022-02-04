import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { Input } from '../../DialogBuilder2/Input';

export class ReverseFeature extends Feature {
    static override readonly id = 'ReverseFeature';

    override async implementation(input: Input, reply: ReplyBuilder): Promise<boolean> {
        if (this.isMessagesPassed(3) && reply.random2([true, false, false])) {
            const reversed = input.originalUtterance.split('').reverse().join('');

            if (reply.random2([true, false])) {
                reply.pitchDownVoice(`${reversed}.`);
            } else {
                reply.hamsterVoice(`${reversed}!`);

                if (reply.random2([true, false])) {
                    reply.silence(500);
                    reply.hamsterVoice(`${reversed}!`);
                }
            }

            return true;
        }

        return false;
    }
}
