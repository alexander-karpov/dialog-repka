import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { Input } from '../../DialogBuilder2/Input';
import { HagiInput } from './HagiInput';

export class YoureMoronFeature extends Feature<HagiInput> {
    static override readonly id = 'YoureMoronFeature';

    // eslint-disable-next-line @typescript-eslint/require-await
    override async implementation(input: Input, reply: ReplyBuilder): Promise<boolean> {
        if (
            !['сука', 'ебан', 'пидар', 'ебуч', 'дебил', 'тупой', 'дурак', 'лох'].some((w) =>
                input.tokens.some((t) => t.startsWith(w))
            )
        ) {
            return false;
        }

        switch (this.triggeredTimes) {
            case 0:
                reply.pitchDownVoice(
                    'Там на фабрике они думали, что я ничего не понимаю. Ты тоже так думаешь?'
                );
                break;
            case 1:
                reply.pitchDownVoice(['Моя улыбка широка.', 'Моя улыбка широк+а.']);
                reply.silence(500);
                reply.pitchDownVoice('Ночью не закрывай глаза.');
                reply.silence(500);
                reply.hamsterVoice('Я приду с тобой играть!');
                break;
            case 2:
                reply.pitchDownVoice('На самом деле я добрый. Давай обнимемся');
                reply.silence(500);
                reply.hamsterVoice('Иди ко мне!');
                break;

            case 3:
                reply.pitchDownVoice('Вчера я видел тебя.');

                reply.silence(500);
                reply.hamsterVoice('Иди ко мне!');
                break;
            default:
                return false;
        }

        return true;
    }
}
