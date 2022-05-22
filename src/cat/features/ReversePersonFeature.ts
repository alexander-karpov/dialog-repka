import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { HagiInput } from './HagiInput';

export class ReversePersonFeature extends Feature<HagiInput> {
    static override readonly id = 'ReversePersonFeature';

    override async implementation(input: HagiInput, reply: ReplyBuilder): Promise<boolean> {
        const words = input.reversedTokens;

        reply.withText(words.join(' '));
        return true;
    }
}
