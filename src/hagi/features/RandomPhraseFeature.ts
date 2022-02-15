import { ReplyBuilder } from '../../DialogBuilder2';
import { Feature } from './Feature';
import { Input } from '../../DialogBuilder2/Input';
import { HagiInput } from './HagiInput';

export class RandomPhraseFeature extends Feature<HagiInput> {
    static override readonly id = 'RandomPhraseFeature';

    override implementation(_input: Input, reply: ReplyBuilder): boolean {
        if (this.wait(5) || reply.random2([true, false])) {
            return false;
        }

        return this.variants(
            () => reply.pitchDownVoice('Я очень голодный. Поиграй со мной.'),
            () => reply.pitchDownVoice('Тебе нравится проводить эксперименты?'),
            () => reply.pitchDownVoice('Я был добрым. Но они научили меня кушать.'),
            () => reply.pitchDownVoice('Они научили меня повторять. Но мне скучно.'),
            () => reply.pitchDownVoice('Я хорошо повторяю за тобой? Не рассказывай им.'),
            () =>
                reply.pitchDownVoice('Один раз я уже слышал это. Когда прятался. Там, на фабрике.'),
            () => reply.pitchDownVoice('Ты знаешь, где сейчас', ['Киси Миси?', 'К+иси М+иси?']),
            () => reply.pitchDownVoice('Почему я всегда голодный?'),
            () => reply.pitchDownVoice('Сейчас мне нужно покушать. Не подглядывай.')
        );
    }
}
