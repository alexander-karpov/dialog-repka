import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { HagiInput } from './HagiInput';

export class ReversePersonFeature extends Feature<HagiInput> {
    static override readonly id = 'ReversePersonFeature';

    override async implementation(input: HagiInput, reply: ReplyBuilder): Promise<boolean> {
        const words = input.reversedTokens.map((t) => t[1]);

        const reversed = words.join(' ');

        if (reversed !== input.originalUtterance) {
            reply.pitchDownVoice(`${reversed}.`);
            return true;
        }

        return false;
    }
}
