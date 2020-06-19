import { RepkaSceneBuilder } from '../RepkaSceneBuilder';
import { RepkaScene } from '../RepkaScene';
import { Character } from '../Character';
import { MystemStemmer } from '../stemmer/MystemStemmer';
import { extractСreature, extractThing } from '../extractChar';
import { replyWithWhoWasCalled } from '../replies/replyWithWhoWasCalled';
import { replyWithKnownCharButtons } from '../replies/replyWithKnownCharButtons';
import { knownChars } from '../knownChars';
import { last } from '../last';
import { Stemmer } from '../stemmer/Stemmer';
import { DumpingStemmer } from '../stemmer/DumpingStemmer';
import { replyWithTaleHelp } from '../replies/replyWithTaleHelp';

export function configureCallСharacter(scene: RepkaSceneBuilder) {
    const stemmer: Stemmer = new DumpingStemmer(new MystemStemmer());

    scene.withReply((reply, state) => {
        replyWithWhoWasCalled(reply, state);

        if (state.characters.length > 1) {
            replyWithKnownCharButtons(reply, state);
        }
    });

    scene.withHelp((reply, state) => {
        replyWithTaleHelp(reply, state);
        replyWithWhoWasCalled(reply, state);
    });

    scene.withUnrecognized((reply, state) => {
        reply.withText('Это не похоже на персонажа.');
        reply.withText('В нашей сказке вы можете позвать любого персонажа.');
        replyWithKnownCharButtons(reply, state, { andVerbal: true });

        replyWithWhoWasCalled(reply, state);
    });

    scene.withInput(async (input, state, setState) => {
        /**
         * Часто в самом начале игры люди вместо того, чтобы назвать персонажа,
         * отвечают на вопрос "Хотите поиграть…" и говорят "Да"
         */
        if (input.isConfirm) {
            return RepkaScene.CallСharacter;
        }

        if ([ 'не знаю', 'никого'].includes(input.command)) {
            return RepkaScene.TaleHelp;
        }

        const tokens = await stemmer.analyze(input.command);
        const calledChar = extractСreature(tokens) || extractThing(tokens);

        if (!calledChar) {
            return undefined;
        }

        setState({ lastCalledChar: calledChar });

        if (Character.isThing(calledChar)) {
            return RepkaScene.ThingCalled;
        }

        setState({ characters: state.characters.concat(calledChar) as [Character] });
        setState({ previousChar: last(state.characters) });

        const knownChar = knownChars.find((char) => char.trigger(calledChar));

        if (knownChar) {
            setState({ seenKnownChars: state.seenKnownChars.concat(knownChar.id) });
        }

        return RepkaScene.TaleChain;
    });
}
