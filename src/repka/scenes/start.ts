import { RepkaSceneName } from '../RepkaSceneName';
import { RepkaTransition } from '../RepkaTransition';

export const Start: RepkaTransition = {
    reply(reply) {
        reply.withText(
            'Хорошо. Давай поиграем. Ты любишь придумывать сказки?',
            ['Я – очень люблю.', '<[200]> Я - очень люблю.'],
            `Ты знаешь сказку, как посадил дед репку? А кто помогал её тянуть?`,
            ['Давай придумаем вместе.', 'Давай придумаем вместе. sil <[500]>'],
        );
    },

    onTransition() {
        return RepkaSceneName.TaleBegin;
    }
}
