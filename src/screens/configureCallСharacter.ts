import { RepkaScreenBuilder } from '../RepkaScreenBuilder';
import { RepkaScreen } from '../RepkaScreen';
import { Character } from '../Character';
import { MystemStemmer } from '../stemmer/MystemStemmer';
import { extractСreature, extractThing } from '../extractChar';
import { replyWithWhoWasCalled } from '../replies/replyWithWhoWasCalled';
import { replyWithKnownCharButtons } from '../replies/replyWithKnownCharButtons';
import { knownChars } from '../knownChars';
import { last } from '../last';
import { Stemmer } from '../stemmer/Stemmer';
import { DumpingStemmer } from '../stemmer/DumpingStemmer';

export function configureCallСharacter(screen: RepkaScreenBuilder) {
    const stemmer: Stemmer = new DumpingStemmer(new MystemStemmer());

    screen.withReply((reply, state) => {
        replyWithWhoWasCalled(reply, state);

        if (state.characters.length > 1) {
            replyWithKnownCharButtons(reply, state);
        }
    });

    screen.withHelp((reply, state) => {
        reply.withText('В нашей сказке вы можете позвать любого персонажа.');
        replyWithKnownCharButtons(reply, state, { andVerbal: true });
        replyWithWhoWasCalled(reply, state);
    });

    screen.withUnrecognized((reply, state) => {
        reply.withText('Это не похоже на персонажа.');
        reply.withText('В нашей сказке вы можете позвать любого персонажа.');
        replyWithKnownCharButtons(reply, state, { andVerbal: true });

        replyWithWhoWasCalled(reply, state);
    });

    screen.withInput(async (input, state, setState) => {
        const tokens = await stemmer.analyze(input.command);
        const calledChar = extractСreature(tokens) || extractThing(tokens);

        if (!calledChar) {
            return undefined;
        }

        setState({ lastCalledChar: calledChar });

        if (Character.isThing(calledChar)) {
            return RepkaScreen.ThingCalled;
        }

        setState({ characters: state.characters.concat(calledChar) as [Character] });
        setState({ previousChar: last(state.characters) });

        const knownChar = knownChars.find((char) => char.trigger(calledChar));

        if (knownChar) {
            setState({ seenKnownChars: state.seenKnownChars.concat(knownChar.id) });
        }

        return RepkaScreen.TaleChain;
    });
}
