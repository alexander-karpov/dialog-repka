import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { HagiInput } from './HagiInput';
import { ReversePersonFeature } from './ReversePersonFeature';

export class VerbTailFeature extends Feature<HagiInput> {
    static override readonly id = 'VerbTailFeature';

    override implementation(input: HagiInput, reply: ReplyBuilder): boolean {
        if (this.wait(4)) {
            return false;
        }

        const verbs = input.reversedTokens.filter((t) => t[2].includes('VERB'));

        if (verbs.length) {
            new ReversePersonFeature().implementation(input, reply);

            for (const v in verbs) {
                reply.pitchDownVoice(`${v[1]}!`);
            }

            return true;
        }

        return false;
    }
}
