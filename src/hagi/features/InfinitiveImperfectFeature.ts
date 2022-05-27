import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from '../../DialogBuilder2/Feature';
import { HagiInput } from './HagiInput';

export class InfinitiveImperfectFeature extends Feature<HagiInput> {
    static override readonly id = 'InfinitiveImperfectFeature';

    override implementation({ reversedTokens }: HagiInput, reply: ReplyBuilder): boolean {
        if (this.wait([3, 4])) {
            return false;
        }

        const inf = reversedTokens.find((t) => t[2].includes('INFN,impf'));

        if (!inf) {
            return false;
        }

        const word = inf[0];

        if (word === 'есть') {
            return false;
        }

        return this.variants(
            () => reply.pitchDownVoice(`Тебе нравится ${word}?`),
            () => reply.pitchDownVoice(`Я не хочу больше ${word}.`),
            () => reply.pitchDownVoice(`Я хочу ${word}!`),
            () => {
                reply.pitchDownVoice(`Они запрещали мне ${word}.`);
                reply.silence(500);
                reply.pitchDownVoice(`Тогда я ушёл.`);
            },
            () => {
                reply.pitchDownVoice(`Если ты будешь ${word}, я съем тебя!`);
            }
        );
    }
}
