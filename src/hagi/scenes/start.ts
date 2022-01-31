import { RepkaSceneName } from '../RepkaSceneName';
import { RepkaTransition } from '../RepkaTransition';

export const Start: RepkaTransition = {
    reply(reply) {
        reply.withText(
            'Х+аги -- кукла из игры!',
            'Ожила - так что беги!',
            'И улыбка широк+а!',
            'Ночью - закрывай глаза!',
            ' - - - - ',
            'Я ХАГИ ВАГИ. Я буду играть с тобой в повторюшку.',
            'Но не зли меня.'
        );
    },

    onTransition(model) {
        model.startTale();

        return RepkaSceneName.CallСharacter;
    },
};
