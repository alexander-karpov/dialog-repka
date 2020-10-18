import { RepkaSceneName } from '../RepkaSceneName';
import { RepkaTransition } from '../RepkaTransition';

export const Start: RepkaTransition = {
    reply(reply) {
        reply.withText(
            ['Привет, ребята!', 'Привет - ребята! - '],
            [`Хотите вместе сочинить сказку?`, `Хотите - - вместе - сочинить сказку? - - `],
            [`Вы слышали как посадил дед репку?`, `Вы слышали - как посадил дед репку? - - `],
            'А кто помогал её тянуть?',
            ['', ' - - '],
            'Давайте придумаем вместе.',
            ['', ' - - - '],
        );
    },

    onTransition() {
        return RepkaSceneName.TaleBegin;
    }
}
