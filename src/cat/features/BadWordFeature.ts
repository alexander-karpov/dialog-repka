import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { Input } from '../../DialogBuilder2/Input';
import { HagiInput } from './HagiInput';
import { isNotEmpty } from '../../isNotEmpty';

export class BadWordFeature extends Feature<HagiInput> {
    static override readonly id = 'BadWordFeature';

    private _badLock: boolean = false;
    private _lastQuitPhraseIndex = -1;

    // eslint-disable-next-line @typescript-eslint/require-await
    override async implementation(input: Input, reply: ReplyBuilder): Promise<boolean> {
        if (
            !this._badLock &&
            !['*', 'дебил', 'тупой', 'дурак', 'лох', 'какашк', 'жопа'].some((w) =>
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
                reply.pitchDownVoice('Я не буду играть с тобой. Уходи.');
                this._badLock = true;
                break;
            default:
                const vars = [0, 1, 2, 3].filter((n) => n != this._lastQuitPhraseIndex);
                this._lastQuitPhraseIndex = isNotEmpty(vars) ? this.random(vars) : 0;

                switch (this._lastQuitPhraseIndex) {
                    case 0:
                        reply.pitchDownVoice('Уходи.');
                        break;
                    case 1:
                        reply.pitchDownVoice('Нет. Уходи.');
                        break;
                    case 2:
                        reply.pitchDownVoice('Я больше не буду добрым. Уходи.');
                        break;
                    case 3:
                        reply.pitchDownVoice('Я не хочу больше играть в повторюшу.');
                        break;
                    default:
                        reply.pitchDownVoice('Ты плохо играешь.');
                        break;
                }
        }

        return true;
    }
}
