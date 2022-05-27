import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from '../../DialogBuilder2/Feature';
import { HagiInput } from './HagiInput';
import { Character } from '../../repka/Character';

const HELLO = new Set([
    'привет',
    'привет хаги ваги',
    'привет как дела',
    'алиса привет',
    'хаги ваги привет',
    'привет привет',
    'как дела привет',
    'ну привет',
    'приветик',
    'здравствуйте',
    'здравствуй',
]);

export class HelloFeature extends Feature<HagiInput> {
    static override readonly id = 'HelloFeature';

    override implementation({ command }: HagiInput, reply: ReplyBuilder): boolean {
        if (!HELLO.has(command)) {
            return false;
        }

        if (this.isFirstTime) {
            reply.withGalleryImage('1521359/729ccabe0a24c1a65139');
        }

        const triggered = this.variants(
            () => reply.pitchDownVoice(`Здравствуй.`),
            () => reply.pitchDownVoice(`Привет. Ты хочешь поиграть?`)
        );

        return triggered;
    }
}
