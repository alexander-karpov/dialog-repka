import { Dialog } from '../DialogBuilder2';
import { RepkaSceneName } from './RepkaSceneName';
import { Start } from './scenes/start';
import { Quit } from './scenes/quit';
import { TaleBegin } from './scenes/taleBegin';
import { TaleChain } from './scenes/taleChain';
import { CallСharacter } from './scenes/callСharacter';
import { ThingCalled } from './scenes/thingCalled';
import { TaleEnd } from './scenes/taleEnd';
import { TaleHelp } from './scenes/taleHelp';

import { RepkaModel } from './RepkaModel';
import { RandomProvider } from '../DialogBuilder2/RandomProvider';

export function createRepka(random?: RandomProvider): Dialog<RepkaSceneName, RepkaModel> {
    return new Dialog<RepkaSceneName, RepkaModel>(RepkaModel, {
        scenes: {
            Start,
            Quit,
            TaleBegin,
            TaleChain,
            CallСharacter,
            ThingCalled,
            TaleEnd,
            TaleHelp,
        },
        whatCanYouDo(reply) {
            reply.withText(
                'В этой игре мы вместе сочиним сказку про репку.',
                'Называйте персонажей и слушайте получившуюся историю.'
            );
        },
        timeout(reply) {
            reply.withText(
                'Ах! Что-то я тебя плохо слышу.',
                'Сядь-ка ко мне на носик, да повтори ещё разок.'
            );
        },
        random: random ?? new RandomProvider(),
    });
}
