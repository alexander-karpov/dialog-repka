import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { Input } from '../../DialogBuilder2/Input';
import { HagiInput } from './HagiInput';

export class RandomPhraseFeature extends Feature<HagiInput> {
    static override readonly id = 'RandomPhraseFeature';

    // eslint-disable-next-line @typescript-eslint/require-await
    override async implementation(_input: Input, reply: ReplyBuilder): Promise<boolean> {
        if (this.isMessagesPassed(5) && reply.random2([true, false])) {
            switch (this.triggeredTimes) {
                case 0:
                    reply.pitchDownVoice('Я очень голодный. Поиграй со мной.');
                    break;
                case 1:
                    reply.pitchDownVoice('Тебе нравится проводить эксперименты?');
                    break;
                case 2:
                    reply.pitchDownVoice('Я был добрым. Но они научили меня кушать.');
                    break;
                default:
                    return false;
            }

            return true;
        }

        return false;
    }
}
