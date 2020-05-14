import { RepkaScreenBuilder } from '../RepkaScreenBuilder';
import { RepkaScreen } from '../RepkaScreen';
import { last } from '../utils/last';
import { Character } from '../Character';

export function configureCallСharacter(screen: RepkaScreenBuilder) {
    screen.withReply((reply, state) => {
        const lastChar = last(state.characters);
        const callWord = lastChar.byGender('позвал', 'позвала', 'позвало');

        reply.withText(`Кого ${callWord} ${lastChar.nominative}?`);
    });

    screen.withInput((input, state, setState) => {
        setState({ characters: state.characters.concat(Character.dedka) as [Character] });
        return RepkaScreen.TaleChain;
    });
}
