import { RepkaTransitionBuilder } from '../RepkaTransitionBuilder';
import { RepkaScene } from '../RepkaScene';
import { Character } from '../Character';

export function configureTaleBegin(scene: RepkaTransitionBuilder) {
    scene.withReply((reply) => {
        reply.withText(
            'Посадил дед репку.',
            'Выросла репка большая-пребольшая.',
            'Стал дед репку из земли тянуть.',
            'Тянет-потянет, вытянуть не может.'
        );
    });

    scene.withTransition((state, setState) => {
        setState({
            characters: [Character.dedka],
            seenKnownChars: [],
            lastCalledChar: Character.dedka,
        });

        return RepkaScene.CallСharacter;
    });
}
