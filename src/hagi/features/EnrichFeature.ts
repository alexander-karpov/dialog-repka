import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { HagiInput } from './HagiInput';

export class EnrichFeature extends Feature<HagiInput> {
    static override readonly id = 'EnrichFeature';

    override async implementation(input: HagiInput, reply: ReplyBuilder): Promise<boolean> {
        if (this.wait(2)) {
            return false;
        }

        const hasEnriched = input.reversedTokens.some((t) => t[3]);

        if (!hasEnriched) {
            return false;
        }

        const words = input.reversedTokens.map((t) => {
            if (t[3]) {
                return `${t[3]} ${t[0]}`;
            }

            return t[1];
        });

        reply.pitchDownVoice(`${words.join(' ')}.`);

        return true;
    }
}
