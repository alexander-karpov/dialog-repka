import { Dialog } from '../DialogBuilder3';
import { CatSceneName as CatSceneName } from './CatSceneName';
import { Start } from './scenes/start';
import { Quit } from './scenes/quit';
import { Talk } from './scenes/talk';
import { CatModel } from './CatModel';
import { RandomProvider } from '../DialogBuilder3/RandomProvider';
import { Introduction } from './scenes/introduction';

export function createCat(random?: RandomProvider): Dialog<CatSceneName, CatModel> {
    return new Dialog<CatSceneName, CatModel>(CatModel, {
        scenes: {
            Start,
            Quit,
            Talk,
            Introduction,
        },
        whatCanYouDo(reply) {
            reply.pitchDownVoice('Я живу на заводе. Я умею прятаться и кусаться.');
            reply.silence(500);
        },
        timeout(reply) {
            reply.pitchDownVoice('Я поиграю с тобой. Просто подойди ближе.');
            reply.hamsterVoice('Подойди ко мне!');
        },
        random: random ?? new RandomProvider(),
    });
}
