import { RepkaSceneName } from '../RepkaSceneName';
import { RepkaTransition } from '../RepkaTransition';

export const TaleBegin:RepkaTransition =  {
    reply(reply)  {
        reply.withText(
            'Посадил дед репку.',
            'Выросла репка большая-пребольшая.',
            'Стал дед репку из земли тянуть.',
            'Тянет-потянет, вытянуть не может.'
        );
    },

    onTransition(model) {
        model.startTale();

        return RepkaSceneName.CallСharacter;
    }
}
