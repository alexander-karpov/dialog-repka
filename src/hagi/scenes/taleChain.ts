import { RepkaSceneName } from '../RepkaSceneName';
import { emoji } from '../emoji';
import { upperFirst } from '../../upperFirst';
import { Character } from '../Character';
import { knownChars } from '../knownChars';
import { RepkaTransition } from '../RepkaTransition';
import { replyRandomSound } from '../replies/replyRandomSound';

export const TaleChain: RepkaTransition = {
    reply(reply, model) {
        reply.withText(model.repeatText);
    },

    onTransition(model) {
        if (model.isTaleEnd()) {
            return RepkaSceneName.TaleEnd;
        }

        return RepkaSceneName.CallСharacter;
    },
};

/**
 * При формировании длинной истории, нужно
 * иногда ставить точки в tts, иначе возникает
 * ужасный дефект синтеза речи.
 * @param pairs кто за кого
 */
function joinCharactersPairsTts(pairs: string[]) {
    const result = [];
    const SEPARATED_PAIRS = 4;

    for (let i = 0; i < pairs.length; i++) {
        const separator = i > 0 && (i % SEPARATED_PAIRS) - 3 === 0 ? '. ' : ' - ';

        result.push(pairs[i], separator);
    }

    result.pop();

    return result.join('');
}
