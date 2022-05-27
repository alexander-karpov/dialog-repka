import { ReplyBuilder } from '../../DialogBuilder3';
import { Feature } from '../../DialogBuilder3/Feature';
import { CatInput } from './CatInput';

export class ReversePersonFeature extends Feature<CatInput> {
    static override readonly id = 'ReversePersonFeature';

    override async implementation(input: CatInput, reply: ReplyBuilder): Promise<boolean> {
        const words = input.reversedTokens;

        reply.withText(words.join(' '));
        return true;
    }
}
