import { ReplyBuilder } from '../../DialogBuilder2';
import { Character } from '../../repka/Character';
import { Feature } from '../../DialogBuilder2/Feature';
import { HagiInput } from './HagiInput';

export class WhoIsThisFeature extends Feature<HagiInput> {
    static override readonly id = 'WhoIsThisFeature';

    override async implementation(
        { character: char }: HagiInput,
        reply: ReplyBuilder
    ): Promise<boolean> {
        if (!char?.isPerson) {
            return false;
        }

        switch (this.triggeredTimes) {
            case 0:
                reply.pitchDownVoice(
                    `Расскажи мне, кто ${Character.byGender2(
                        char,
                        'такой',
                        'такая'
                    )} ${Character.nominative(char)}?`
                );
                break;
            case 1:
                reply.pitchDownVoice(
                    `Где найти ${Character.accusative(char)}?`,
                    `Я хочу обнять ${Character.byGender2(char, 'его', 'её')}.`
                );
                break;
            case 2 + (this.isMessagesPassed(3) ? 0 : -100):
                reply.pitchDownVoice(
                    `Кто ${Character.byGender2(char, 'такой', 'такая')} ${Character.nominative(
                        char
                    )}?`,
                    `Это ${Character.byGender2(
                        char,
                        'он проводил',
                        'она проводила'
                    )} надо мной эксперименты?`
                );
                break;
            case 3:
                reply.pitchDownVoice(`Я видел ${Character.accusative(char)} в лаборатории.`);
                reply.hamsterVoice(`Не обманывай меня!`);
                break;
            default:
                return false;
        }

        return true;
    }
}
