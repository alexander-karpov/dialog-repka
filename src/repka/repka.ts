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

export const repka = new Dialog<RepkaSceneName, RepkaModel>(RepkaModel, {
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
});
