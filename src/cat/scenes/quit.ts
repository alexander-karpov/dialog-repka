import { HagiEnding } from '../HagiEnding';

export const Quit: HagiEnding = {
    reply(reply) {
        reply.selectRandom(
            (text) => {
                reply.pitchDownVoice(text);
            },
            [
                'Сегодня я отпускаю тебя. Но не радуйся сильно.',
                'На этот раз тебе удалось убежать. Но мы ещё поиграем.',
                'Уходи. Но помни, ночью закрывай глаза!',
            ]
        );
    },
};
