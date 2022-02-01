import { RepkaSceneName } from '../RepkaSceneName';
import { RepkaTransition } from '../RepkaTransition';

export const TaleChain: RepkaTransition = {
    reply(reply, model) {
        reply.pitchDownVoice(model.repeatText);
    },

    onTransition(model) {
        if (model.isTaleEnd()) {
            return RepkaSceneName.TaleEnd;
        }

        return RepkaSceneName.CallСharacter;
    },
};
