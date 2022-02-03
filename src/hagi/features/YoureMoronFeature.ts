import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { Input } from '../../DialogBuilder2/Input';

export class YoureMoronFeature extends Feature {
    static id = 'YoureMoronFeature';

    // eslint-disable-next-line @typescript-eslint/require-await
    async implementation(input: Input, reply: ReplyBuilder): Promise<boolean> {
        if (!input.command.includes('дебил')) {
            return false;
        }

        switch (this.triggeredTimes) {
            case 0:
                reply.pitchDownVoice(
                    'Там на фабрике они думали, что я ничего не понимаю. Ты тоже так думаешь?'
                );
                break;
            case 1 + (this.isMessagesPassed(2) ? 0 : -100):
                reply.pitchDownVoice(['Моя улыбка широка.', 'Моя улыбка широк+а.']);
                reply.silence(500);
                reply.pitchDownVoice('Ночью не закрывай глаза!');
                break;
            case 2 + (this.isMessagesPassed(2) ? 0 : -100):
                reply.pitchDownVoice('На самом деле я добрый. Давай обнимемся');
                reply.silence(500);
                reply.hamsterVoice('Иди.');
                reply.silence(100);
                reply.hamsterVoice('ко');
                reply.silence(100);
                reply.hamsterVoice('мне!');
                break;
            default:
                return false;
        }

        return true;
    }
}
