import { RepkaScreenBuilder } from '../RepkaScreenBuilder';
import { RepkaScreen } from '../RepkaScreen';
import { Character } from '../Character';

export function configureBeginOfTale(screen: RepkaScreenBuilder) {
    screen.withReply((reply) => {
        reply.withText(
            'Посадил дед репку.',
            'Выросла репка большая-пребольшая.',
            'Стал дед репку из земли тянуть.',
            'Тянет-потянет, вытянуть не может.'
        );
    });

    screen.withTransition((state, setState) => {
        setState({
            characters: [Character.dedka],
            seenKnownChars: [],
            lastCalledChar: Character.dedka,
        });

        return RepkaScreen.CallСharacter;
    });
}
