import { HagiSceneName } from '../HagiSceneName';
import { HagiTransition } from '../HagiTransition';

export const Start: HagiTransition = {
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
        reply.pitchDownVoice('А теперь скажи что-нибудь.');
    },

    onTransition(model) {
        return HagiSceneName.CallСharacter;
    },
};
