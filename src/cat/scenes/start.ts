import { CatScene } from '../HagiScene';
import { HagiSceneName } from '../HagiSceneName';
import { HagiTransition } from '../HagiTransition';

export const Start: CatScene = {
    reply(reply) {
        reply.withText(
            'Кысь-кысь. Кто тут у нас? Это маленький котёнок,',
            'который ищет друзей. Хочешь с ним поговорить?',
            'Я немного знаю кошачий язык и буду переводить.',
            'Чтобы начать, скажи «мяу»'
        );
    },

    unrecognized(repka, model) {
        if (model.startPhrase) {
            repka.withText(`Не «${model.startPhrase}», а «мяу»`);
        } else {
            repka.withText('Чтобы начать, скажи «мяу»');
        }
    },

    async onInput(input, model, reply) {
        if (input.tokens.includes('мяу')) {
            reply.withText('Мяу-мяу. Кто здесь?');

            return HagiSceneName.CallСharacter;
        }

        model.startPhrase = input.originalUtterance;
    },
};
