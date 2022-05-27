import { CatScene } from '../CatScene';
import { CatSceneName } from '../CatSceneName';

export const Start: CatScene = {
    reply(reply) {
        reply.withText(
            'Кысь-кысь. Кто тут у нас? Это же мой знакомый котёнок.',
            'Хочешь с ним поговорить?',
            'Я немного знаю кошачий язык и буду переводить.',
            'Запомни главное правило кошачьего языка:',
            'если не знаешь, что сказать, скажи «мяу».',
            'Давай попробуем?'
        );
    },

    help(reply) {
        reply.withText('Если не знаешь, что сказать, скажи «мяу»');
    },

    unrecognized() {
        // В этом случае ничего не говорим
    },

    async onInput(input, model, reply) {
        if (input.tokens.includes('мяу')) {
            reply.withText('Мяу-мяу. А ты кто?');

            return CatSceneName.Talk;
        }

        reply.withText(`Не «${input.originalUtterance}», а «мяу»`);
    },
};
