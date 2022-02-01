import { Dialog } from '../DialogBuilder2';
import { RepkaSceneName } from './RepkaSceneName';
import { Start } from './scenes/start';
import { Quit } from './scenes/quit';
import { TaleChain } from './scenes/taleChain';
import { CallСharacter } from './scenes/callСharacter';
import { ThingCalled } from './scenes/thingCalled';
import { TaleEnd } from './scenes/taleEnd';
import { TaleHelp } from './scenes/taleHelp';

import { HagiModel } from './HagiModel';
import { RandomProvider } from '../DialogBuilder2/RandomProvider';

export function createHagi(random?: RandomProvider): Dialog<RepkaSceneName, HagiModel> {
    return new Dialog<RepkaSceneName, HagiModel>(HagiModel, {
        scenes: {
            Start,
            Quit,
            TaleChain,
            CallСharacter,
            ThingCalled,
            TaleEnd,
            TaleHelp,
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
