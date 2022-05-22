import { Dialog } from '../DialogBuilder2';
import { HagiSceneName as HagiSceneName } from './HagiSceneName';
import { Start } from './scenes/start';
import { Quit } from './scenes/quit';
import { TaleChain } from './scenes/taleChain';
import { CallСharacter } from './scenes/callСharacter';
import { CatModel } from './CatModel';
import { RandomProvider } from '../DialogBuilder2/RandomProvider';

export function createHagi(random?: RandomProvider): Dialog<HagiSceneName, CatModel> {
    return new Dialog<HagiSceneName, CatModel>(CatModel, {
        scenes: {
            Start,
            Quit,
            TaleChain,
            CallСharacter,
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
