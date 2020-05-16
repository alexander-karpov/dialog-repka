import { RepkaScreenBuilder } from '../RepkaScreenBuilder';
import { RepkaScreen } from '../RepkaScreen';
import { last } from '../last';
import { Character } from '../Character';
import { MystemStemmer } from '../stemmer/MystemStemmer';
import { extractСreature, extractThing } from '../extractChar';
import { replyWithWhoWasCalled } from '../replies/replyWithWhoWasCalled';
import { replyWithKnownCharButtons } from '../replies/replyWithKnownCharButtons';

export function configureCallСharacter(screen: RepkaScreenBuilder) {
    const stemmer = new MystemStemmer();

    screen.withReply((reply, state) => {
        replyWithWhoWasCalled(reply, state);
    });

    screen.withUnrecognized((reply, state) => {
        reply.withText('Это не похоже на персонажа.');
        replyWithWhoWasCalled(reply, state);
        replyWithKnownCharButtons(reply, state);
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

        if (calledChar) {
            setState({ characters: state.characters.concat(calledChar) as [Character] });
            return RepkaScreen.TaleChain;
        }
    });
}
