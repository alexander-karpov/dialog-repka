import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { HagiInput } from './HagiInput';

export class InfinitivePerfectFeature extends Feature<HagiInput> {
    static override readonly id = 'InfinitivePerfectFeature';

    override implementation({ reversedTokens }: HagiInput, reply: ReplyBuilder): boolean {
        if (this.wait([3, 4])) {
            return false;
        }

        const inf = reversedTokens.find((t) => t.includes('INFN,perf'));

        if (!inf) {
            return false;
        }

        const word = inf[0];

        if (word === 'есть') {
            return false;
        }

        return this.variants(
            () => reply.pitchDownVoice(`Сейчас мне нужно ${word}.`),
            () => reply.pitchDownVoice(`Ты хочешь ${word}?`),
            () => reply.pitchDownVoice(`Не пытайся ${word}. Не зли меня.`),
            () => {
                reply.pitchDownVoice(`Я просто хотел ${word}. Но они не поняли.`);
            },
            () => {
                reply.pitchDownVoice(`Мне сказали, что я должен ${word}.`);
                reply.silence(500);
                reply.pitchDownVoice(`Но я не захотел.`);
            }
        );
    }
}
