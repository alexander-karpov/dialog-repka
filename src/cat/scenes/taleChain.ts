import { HagiSceneName } from '../HagiSceneName';
import { HagiTransition } from '../HagiTransition';

export const TaleChain: HagiTransition = {
    reply(reply, model) {
        // Hello Hagi
    },

    onTransition(model) {
        return HagiSceneName.CallСharacter;
    },
};
