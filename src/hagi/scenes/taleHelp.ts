import { replyWithTaleHelp } from '../replies/replyWithTaleHelp';
import { RepkaSceneName } from '../RepkaSceneName';
import { RepkaTransition } from '../RepkaTransition';

export const TaleHelp: RepkaTransition =  {
    reply (reply, state) {
        replyWithTaleHelp(reply, state);
    },

    onTransition() {
        return RepkaSceneName.CallСharacter;
    }
}
