import { Ending } from '../../DialogBuilder3';
import { CatModel } from '../CatModel';

export const Quit: Ending<CatModel> = {
    reply(reply) {
        reply.selectRandom(
            (text) => {
                reply.withText(text);
            },
            ['Мне тоже уже пора. Пока!', 'Ну всё, я пошёл. Заходи ещё потом', 'До встречи. Пиу!']
        );
    },
};
