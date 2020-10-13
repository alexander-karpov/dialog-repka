import { RepkaTransitionBuilder } from '../RepkaTransitionBuilder';
import { RepkaScene } from '../RepkaScene';
import { emoji } from '../emoji';
import { upperFirst } from '../../upperFirst';
import { Character } from '../Character';
import { RepkaState } from '../RepkaState';
import * as intents from '../intents';
import { knownChars } from '../knownChars';
import { replyWithKnownChar } from '../replies/replyWithKnownChar';

export function configureTaleChain(scene: RepkaTransitionBuilder) {
    scene.withReply((reply, state) => {
        /**
         * Известный персонаж
         */
        const knownChar = knownChars.find((char) => char.trigger(state.lastCalledChar));

        if (knownChar) {
            replyWithKnownChar(reply, state, knownChar);
        }

        /**
         * Цепочка
         */
        const text: string[] = [];
        const tts: string[] = [];

        for (let i = 0; i < state.characters.length - 1; i++) {
            const sub = state.characters[i + 1];
            const obj = state.characters[i];
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
        if (isTaleEnd(state)) {
            reply.withText([
                'Тянут-потянут 🎉 вытянули репку!',
                'Тянут-потянут <speaker audio="alice-sounds-human-kids-1.opus"> - вытянули репку!',
            ]);
        } else {
            reply.withText(`Тянут-потянут — вытянуть не могут.`);
        }
    });

    scene.withTransition((state) => {
        if (isTaleEnd(state)) {
            return RepkaScene.TaleEnd;
        }

        return RepkaScene.CallСharacter;
    });

    function isTaleEnd({ lastCalledChar }: RepkaState) {
        return intents.mouse(lastCalledChar);
    }
}
