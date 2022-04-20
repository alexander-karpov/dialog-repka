import { RepkaSceneName } from '../RepkaSceneName';
import { emoji } from '../emoji';
import { upperFirst } from '../../upperFirst';
import { Character } from '../Character';
import { knownChars } from '../knownChars';
import { RepkaTransition } from '../RepkaTransition';
import { replyRandomSound } from '../replies/replyRandomSound';
import { RepkaTaleChainLink } from '../RepkaTaleChainLink';

function maxLen(text: [string, string]) {
    return Math.max(text[0].length, text[1].length);
}

export const TaleChain: RepkaTransition = {
    reply(reply, model) {
        const lastCalledChar = model.lastCalledCharacter();
        const knownChar = knownChars.find((char) => char.trigger(lastCalledChar));

        if (!knownChar?.phrase) {
            reply.withText([
                `${Character.byNumber(lastCalledChar, 'Я', 'Мы')} ${Character.nominative(
                    lastCalledChar
                )}.`,
                `${Character.byNumber(lastCalledChar, 'Я', 'Мы')} ${Character.nominativeTts(
                    lastCalledChar
                )}.`,
            ]);
        }

        if (knownChar) {
            replyRandomSound(reply, knownChar);

            if (knownChar.image) {
                reply.withImage(knownChar.image);
            }
        }

        if (knownChar?.phrase) {
            knownChar?.phrase(reply, model);
        } else {
            reply.selectRandom(
                (phrase) => {
                    reply.withText(phrase);
                    model.setLastCharacterPhrase(phrase);
                },
                Character.byNumber(
                    lastCalledChar,
                    ['Помогу вам.', 'Буду помогать.', 'Помогу вытянуть репку.'],
                    ['Поможем вам.', 'Будем помогать.', 'Поможем вытянуть репку.']
                ),
                1,
                (phrase) => !model.isLastCharacterPhrase(phrase)
            );
        }

        /**
         * Цепочка
         */
        const lastLink: [string, string] = [`, дедка 👴 за репку.`, ' - дедка за репку.'];
        const end: [string, string] = model.isTaleEnd()
            ? [
                  'Тянут-потянут – 🎉 – вытянули репку!',
                  'Тянут-потянут <speaker audio="alice-sounds-human-kids-1.opus"> - вытянули репку!',
              ]
            : [`Тянут-потянут — вытянуть не могут.`, `Тянут-потянут — вытянуть не могут.`];

        let charsLeft = 850 - maxLen(lastLink) - maxLen(end);

        const links = model.pairs().map((pair) => new RepkaTaleChainLink(pair[1], pair[0]));

        const text: string[] = [];
        const tts: string[] = [];

        for (let link of links) {
            text.push(link.versions.full[0]);
            tts.push(link.versions.full[1]);
        }

        charsLeft -= Math.max(
            text.reduce((len, t) => len + t.length, 0),
            tts.reduce((len, t) => len + t.length, 0)
        );

        for (let i = 0; i < links.length - 1 && charsLeft < 0; i++) {
            const link = links[i] as RepkaTaleChainLink;

            text[i] = link.versions.short[0];
            tts[i] = link.versions.short[1];

            charsLeft += maxLen(link.versions.full) - maxLen(link.versions.short);
        }

        for (let i = 0; i < links.length - 1 && charsLeft < 0; i++) {
            const link = links[i] as RepkaTaleChainLink;

            text[i] = link.versions.shortest[0];
            tts[i] = link.versions.shortest[1];

            charsLeft += maxLen(link.versions.short) - maxLen(link.versions.shortest);
        }

        text.reverse();
        tts.reverse();

        reply.withText([upperFirst(text.join(', ')), joinCharactersPairsTts(tts)], lastLink);

        /**
         * Тянут-потянут
         */
        reply.withText(end);
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
