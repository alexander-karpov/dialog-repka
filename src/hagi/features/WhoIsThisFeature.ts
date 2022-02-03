import { ReplyBuilder } from '../../DialogBuilder2';
import { Input } from '../../DialogBuilder2/Input';
import { CharactersFactory } from '../../repka/characters/CharactersFactory';
import { Character } from '../../repka/Character';
import { Feature } from './Feature';

const charactersFactory = new CharactersFactory();

export class WhoIsThisFeature extends Feature {
    static id = 'WhoIsThisFeature';

    async implementation(input: Input, reply: ReplyBuilder): Promise<boolean> {
        const char = await charactersFactory.create(input.command);

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
