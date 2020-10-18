import { RepkaSceneName } from '../RepkaSceneName';
import { emoji } from '../emoji';
import { upperFirst } from '../../upperFirst';
import { Character } from '../Character';
import { knownChars } from '../knownChars';
import { RepkaTransition } from '../RepkaTransition';
import { replyWithKnownChar } from '../replies/replyWithKnownChar';

export const TaleChain: RepkaTransition  = {
    reply (reply, model) {
        /**
         * Известный персонаж
         */
        const knownChar = knownChars.find((char) => char.trigger(model.lastCalledCharacter()));

        if (knownChar) {
            replyWithKnownChar(reply, model, knownChar);
        }

        /**
         * Цепочка
         */
        const text: string[] = [];
        const tts: string[] = [];

        for (const pair of model.pairs()) {
            const obj = pair[0];
            const sub = pair[1];
            const em = emoji[Character.nominative(sub)] || emoji[sub.normal];
            const emojiPart = em ? ` ${em}` : '';

            text.push(`${Character.nominative(sub)}${emojiPart} за ${Character.accusative(obj)}`);
            tts.push(`${Character.nominativeTts(sub)} за ${Character.accusativeTts(obj)}`);
        }

        text.reverse();
        tts.reverse();

        reply.withText(
            [upperFirst(text.join(', ')), tts.join(' - ')],
            [`, дедка 👴 за репку.`, ' - дедка за репку.']
        );

        /**
         * Тянут-потянут
         */
        if (model.isTaleEnd()) {
            reply.withText([
                'Тянут-потянут 🎉 вытянули репку!',
                'Тянут-потянут <speaker audio="alice-sounds-human-kids-1.opus"> - вытянули репку!',
            ]);
        } else {
            reply.withText(`Тянут-потянут — вытянуть не могут.`);
        }
    },

    onTransition(model) {
        if (model.isTaleEnd()) {
            return RepkaSceneName.TaleEnd;
        }

        return RepkaSceneName.CallСharacter;
    }
}
