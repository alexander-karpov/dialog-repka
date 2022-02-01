import { RepkaSceneName } from '../RepkaSceneName';
import { RepkaTransition } from '../RepkaTransition';

export const Start: RepkaTransition = {
    reply(reply) {
        reply.pitchDownVoice(
            ['Хаги - кукла из игры.\n', 'Х+аги -- кукла из игры!'],
            ['Ожила так что беги.\n', 'Ожила - так что беги.']
        );

        reply.silence(500);
        reply.pitchDownVoice('Я ХАГИ ВАГИ. Я буду играть с тобой в повторюшу.');
        reply.silence(500);
        reply.hamsterVoice('Но не зли меня!');

        reply.silence(500);
        reply.hamsterVoice('А теперь скажи что-нибудь.');
    },

    onTransition(model) {
        model.startTale();

        return RepkaSceneName.CallСharacter;
    },
};
