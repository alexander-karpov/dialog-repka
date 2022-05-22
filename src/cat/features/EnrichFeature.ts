import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { HagiInput } from './HagiInput';

export class EnrichFeature extends Feature<HagiInput> {
    static override readonly id = 'EnrichFeature';

    override async implementation(input: HagiInput, reply: ReplyBuilder): Promise<boolean> {
        const hasEnriched = input.reversedTokens.some((t) => t);

        if (!hasEnriched) {
            return false;
        }

        const words = input.reversedTokens.map((t) => {
            if (t) {
                return `${t} ${t}`;
            }

            return t;
        });

        reply.pitchDownVoice(`${words.join(' ')}.`);

        return true;
    }
}
