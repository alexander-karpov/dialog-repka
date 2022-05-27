import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from '../../DialogBuilder2/Feature';
import { Input } from '../../DialogBuilder2/Input';
import { HagiInput } from './HagiInput';
import { Character } from '../../repka/Character';

export class KissyMissyFeature extends Feature<HagiInput> {
    static override readonly id = 'KissyMissyFeature';

    override implementation({ character: char }: HagiInput, reply: ReplyBuilder): boolean {
        if (!char) {
            return false;
        }

        if (char.normal !== 'киси миси') {
            return false;
        }

        const triggered = this.variants(
            () => reply.pitchDownVoice(`Я не буду говорить о ${Character.nominative(char)}.`),
            () =>
                reply.pitchDownVoice(
                    `Я помню ${Character.nominative(char)}. Видел её. На фабрике. В последний раз.`
                ),
            () => reply.pitchDownVoice(`Ничего не говори о ${Character.nominative(char)}!`),
            () => {
                reply.pitchDownVoice(`Мы дружили с ${Character.nominative(char)}.`);
                reply.silence(500);
                reply.pitchDownVoice(`Но потом.`);
                reply.silence(1000);
                reply.pitchDownVoice(`Это всё они.`);
            }
        );

        if (triggered && this.triggeredTimes === 0) {
            reply.withGalleryImage('1030494/8b7288a28bfa796fc2d4');
        }

        return triggered;
    }
}
