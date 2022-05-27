import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from '../../DialogBuilder2/Feature';
import { HagiInput } from './HagiInput';
import { ReversePersonFeature } from './ReversePersonFeature';

export class SplitByOrFeature extends Feature<HagiInput> {
    static override readonly id = 'SplitByOrFeature';

    override async implementation(input: HagiInput, reply: ReplyBuilder): Promise<boolean> {
        if (input.reversedTokens.length < 3) {
            return false;
        }

        const orIndex = input.reversedTokens.findIndex((t) => t[0] === 'или');

        if (orIndex === -1) {
            return false;
        }

        const splitted = this.random([true, false])
            ? input.reversedTokens.slice(0, orIndex)
            : input.reversedTokens.slice(orIndex + 1);

        return new ReversePersonFeature().implementation(
            {
                ...input,
                reversedTokens: splitted,
            },
            reply
        );
    }
}
